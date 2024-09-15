from pydantic import BaseModel

class MenuItem(BaseModel):
    name: str
    ingredients: list[str]

class Menu(BaseModel):
    choices: list[MenuItem]

class CarbonCost(BaseModel):
    item_name: str
    carbon_cost: float
    red_flags: list[str]
    score: int
