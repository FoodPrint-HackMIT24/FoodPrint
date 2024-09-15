from pydantic import BaseModel

class MenuItem(BaseModel):
    name: str
    ingredients: list[str]

class Menu(BaseModel):
    choices: list[MenuItem]

class CarbonCost(BaseModel):
    carbon_cost: float
    explanation: str
    red_flags: list[str]
    score: int
