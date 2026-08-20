from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Automatic Bank Loan Approval"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./loan_app.db"

    class Config:
        case_sensitive = True

settings = Settings()
