import os
import sys
import json

from fastapi import FastAPI

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from utils import openai_utils
from models import requests, menus

app = FastAPI()

@app.post("/score_menu")
def score_menu(request: requests.RequestBody):
    completion_message = openai_utils.calculate_score(request.image)
    message_content = completion_message.choices[0].message.content
    cleaned_content = message_content.replace('```json', '').replace('```', '').strip()
    menu_dict = json.loads(cleaned_content)
    menu = menus.Menu(**menu_dict)

    menu_scored = []

    for item in menu.choices[:3]:
        carbon_cost = openai_utils.calculate_carbon_cost(item.name)
        menu_scored.append(carbon_cost)

    return requests.ResponseBody(item_list=menu_scored)
