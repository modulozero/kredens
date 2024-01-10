from collections.abc import Generator
from functools import lru_cache
from typing import Annotated
from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

from .settings import Settings, get_settings

Base = declarative_base()


@lru_cache
def get_sessionmaker(database_url: str) -> sessionmaker[Session]:
    engine = create_engine(database_url)
    return sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db(
    settings: Annotated[Settings, Depends(get_settings)],
) -> Generator[Session, None, None]:
    db = get_sessionmaker(str(settings.database_url))()
    try:
        yield db
    finally:
        db.close()
