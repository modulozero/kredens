from typing import Union

from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from fastapi import Depends, FastAPI

from kredens.database import get_db


app = FastAPI()

@app.get("/")
def read_root(session: Session = Depends(get_db)):
    return {"Hello": "World", "Database": next(session.execute(text("SELECT 1")))[0]}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
