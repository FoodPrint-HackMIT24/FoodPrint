import os
import sys

from dotenv import load_dotenv
from openai import OpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_openai import ChatOpenAI

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models import menus

load_dotenv()

openai_key = os.getenv('OPENAI_API_KEY')
openai_client = OpenAI()

open_langchain = ChatOpenAI(model="gpt-4o", temperature=0)

def calculate_score(image: str):    
    completion = openai_client.chat.completions.create(
        model="gpt-4o",
        max_tokens=4096,
        temperature=0.0,
        messages=[
            {
                "role": "system",
                "content": f"""
                You are a culinary expert designed to extract food items and their ingredients from a menu.
                Please identify every menu item the image and provide a list of every ingredient listed on the menu for that item.
                If the ingredients are not listed, make an educated guess about what the ingredients are. Simplify the ingredients to raw materials.
                You must return a correctly formatted JSON object with the menu item name and the list of ingredients in the image and follows the schema below:

                JSON Schema:
                {menus.Menu.model_json_schema()}""",
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """Extract the products from the image,
                        and describe them in a query in JSON format""",
                    },
                    {
                        "type": "image_url", "image_url": {
                        "url": f"data:image/jpeg;base64,{image}"}},

                ],
            },
            {
                "role": "assistant",
                "content": "```json",
            },
        ],
    )
    print(">>> openai read the menu:")
    print(completion)

    return completion

def calculate_carbon_cost(ingredient: str):
    system_prompt = f"""
    You are a environmental expert designed to calculate the carbon cost of food items and explain the carbon cost of the food item in pounds.
    Calculate the carbon cost of the food item in the message below and explain why the carbon cost is that value.
    Also provide a list of red flags that indicate that the production of the food item involves unsustainable practices such as human rights violations in third world countries, animal welfare concerns, etc. Keep each red flag to a few words.
    Finally, based on this information, provide a sustainability score for the food item on a scale of 1 to 10
    Also return the name of the food item provided in the prompt back in the response as the item name.
    """

    chat_history = ChatMessageHistory()
    chat_history.add_message(SystemMessage(content=system_prompt))
    chat_history.add_message(HumanMessage(content=ingredient))

    prompt_template = ChatPromptTemplate.from_messages(
        [MessagesPlaceholder("messages"), SystemMessage(content=system_prompt)])
    runnable = prompt_template | open_langchain.with_structured_output(
        schema=menus.CarbonCost, include_raw=True)
    
    carbon_cost = runnable.invoke({"messages": chat_history.messages})
    print(">>> openai calculated the carbon cost:")
    print(carbon_cost)

    return carbon_cost["parsed"]
