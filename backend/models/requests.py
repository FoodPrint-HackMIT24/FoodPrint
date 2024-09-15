import os
import sys

from pydantic import BaseModel

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models import menus

class RequestBody(BaseModel):
    image: str

class ResponseBody(BaseModel):
    item_list: list[menus.CarbonCost]
