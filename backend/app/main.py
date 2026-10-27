import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .config import settings
from .database import engine, Base, get_db
from .seed_data import init_db_and_seed
from .routers import (
    auth_routes,
    profile_routes,
    activity_routes,
    dashboard_routes,
    analytics_routes,
    rewards_routes,
    leaderboard_routes,
)

# Create tables and seed initial catalog data on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure tables are created
    Base.metadata.create_all(bind=engine)
    # Run seed
    from .database import SessionLocal
    db = SessionLocal()
    try:
        init_db_and_seed(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Smart Household Carbon Footprint Tracker — REST API with scientific calculations & gamification engine.",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_routes.router, prefix=settings.API_V1_STR)
app.include_router(profile_routes.router, prefix=settings.API_V1_STR)
app.include_router(activity_routes.router, prefix=settings.API_V1_STR)
app.include_router(dashboard_routes.router, prefix=settings.API_V1_STR)
app.include_router(analytics_routes.router, prefix=settings.API_V1_STR)
app.include_router(rewards_routes.router, prefix=settings.API_V1_STR)
app.include_router(leaderboard_routes.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "app": "EcoTrace API",
        "status": "operational",
        "version": settings.VERSION,
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "EcoTrace Backend Engine",
        "database": "connected"
    }

@app.get("/api/calculations/info")
def calculations_documentation():
    """
    Transparent documentation of calculation standards and carbon auditing methodology.
    """
    return {
        "grid_electricity": {
            "formula": "Electricity Consumption (kWh) = (Power in Watts × Hours Used × Quantity) / 1000",
            "emissions_formula": "CO2 Emissions (kg) = Electricity (kWh) × Grid Emission Factor",
            "factor_used": settings.ELECTRICITY_EMISSION_FACTOR,
            "factor_unit": "kg CO2 / kWh",
            "source": "Central Electricity Authority (CEA) India CO2 Baseline Database"
        },
        "lpg_cooking_gas": {
            "distinction": "Gas stove emissions are calculated from fuel consumption (mass of LPG burned) and NOT converted from electrical watts.",
            "formula": "LPG Consumed (kg) = Hours Used × Burners × 0.15 kg/hr (medium flame)",
            "emissions_formula": "CO2 Emissions (kg) = LPG (kg) × 2.983 kg CO2/kg LPG",
            "thermal_energy_equivalent": "1 kg LPG ≈ 12.8 kWh thermal energy",
            "source": "IPCC Guidelines for National Greenhouse Gas Inventories"
        },
        "gamification_rules": {
            "tracking_bonus": "+10 EcoCredits per activity logged",
            "onboarding_bonus": "+50 EcoCredits on completing household profile",
            "under_budget_bonus": "+25 EcoCredits for verified sub-target daily carbon footprint",
            "streak_milestones": "Multipliers at 3, 7, and 14 days consecutive tracking",
            "ecoscore_model": "45% Budget adherence + 30% Streak consistency + 25% Audit completeness"
        }
    }
