from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    database_hostname: str
    database_port: int
    database_password: str
    database_name: str
    database_username: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int
    
    super_admin_code: str

    database_url: str
    test_database_url: str
    model_config = ConfigDict(env_file=".env")

settings = Settings()