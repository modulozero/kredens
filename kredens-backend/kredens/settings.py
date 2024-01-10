from functools import lru_cache

from pydantic import PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: PostgresDsn

    model_config = SettingsConfigDict(env_file=".env")


@lru_cache
def get_settings():
    # PyLance doesn't understand that it's a dotenv based thing
    return Settings() # type: ignore
