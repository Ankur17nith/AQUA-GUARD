import os

class Settings:
    PROJECT_NAME: str = "AQUA//GUARD Climate Decision Platform"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    AQUAGUARD_MODE: str = os.getenv("AQUAGUARD_MODE", "DEMO") # 'LIVE' or 'DEMO'
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./aquaguard.db")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Conduit Configuration (3D-PAWS UCAR)
    CONDUIT_API_URL: str = os.getenv("CONDUIT_API_URL", "https://3d-fewsnet.icdp.ucar.edu/api/v1/data/61.geojson")
    CONDUIT_API_KEY: str = os.getenv("CONDUIT_API_KEY", "")
    CONDUIT_API_EMAIL: str = os.getenv("CONDUIT_API_EMAIL", "3dpaws@meteo.go.ke")
    CONDUIT_PRIMARY_STATION_ID: int = int(os.getenv("CONDUIT_STATION_ID", "61"))
    
    # Secondary Context
    WEATHER_API_URL: str = os.getenv("WEATHER_API_URL", "https://api.open-meteo.com/v1")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]

settings = Settings()
