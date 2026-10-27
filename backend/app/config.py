import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings:
    PROJECT_NAME: str = "EcoTrace API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "ecotrace-super-secret-jwt-key-2026-sustainability-auth")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database: SQLite default for zero-setup local dev, or Supabase PostgreSQL
    # e.g. postgresql://postgres.xxxx:pass@aws-0-region.pooler.supabase.com:6543/postgres
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/ecotrace.db")
    
    # Emission Factors (Configurable & documented)
    # India CEA 2023 grid average: 0.82 kg CO2 / kWh
    # US EPA average is ~0.385, DEFRA UK is ~0.207
    ELECTRICITY_EMISSION_FACTOR: float = float(os.getenv("ELECTRICITY_EMISSION_FACTOR", "0.82"))
    
    # LPG Gas cooking emission factor: ~2.983 kg CO2 per kg LPG
    # Typical standard gas burner consumption: ~0.15 kg LPG / hour on medium flame
    # Equivalently ~0.202 kg CO2 / kWh thermal
    LPG_EMISSION_FACTOR_PER_KG: float = float(os.getenv("LPG_EMISSION_FACTOR_PER_KG", "2.983"))
    LPG_KG_PER_HOUR_MEDIUM: float = float(os.getenv("LPG_KG_PER_HOUR_MEDIUM", "0.15"))
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

settings = Settings()
