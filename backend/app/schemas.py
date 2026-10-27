import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field

# Auth schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2)
    username: str = Field(..., min_length=3)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserProfileResponse(BaseModel):
    id: str
    email: str
    full_name: str
    username: str
    avatar_url: Optional[str] = None
    onboarding_completed: bool
    eco_credits: int
    eco_score: float
    current_streak: int
    longest_streak: int
    created_at: datetime.datetime
    household: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    username: Optional[str] = None
    avatar_url: Optional[str] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None

# Onboarding and Household
class ApplianceSelectionItem(BaseModel):
    appliance_id: Optional[str] = None
    name: str
    category: str
    power_watts: float
    fuel_type: str = "electric"
    quantity: int = 1
    typical_daily_hours: Optional[float] = 2.0

class OnboardingSubmit(BaseModel):
    # Step 1: User
    full_name: str
    username: str
    household_members: int = Field(default=3, ge=1)
    
    # Step 2: Household
    home_type: str = "2BHK"
    area_sqft: float = Field(default=1000.0, ge=100)
    city_state: str = "Bangalore, Karnataka"
    avg_hours_at_home: float = Field(default=14.0, ge=1, le=24)
    
    # Step 3: Appliances
    selected_appliances: List[ApplianceSelectionItem] = []
    
    # Step 4: Budget target
    custom_daily_co2_target_kg: Optional[float] = None

class BudgetTargetUpdate(BaseModel):
    daily_co2_target_kg: float = Field(..., ge=1.0, le=100.0)

# Activity Logging
class ActivityEstimateRequest(BaseModel):
    fuel_type: str = "electric"
    power_watts: float = 100.0
    quantity: int = 1
    duration_minutes: float = 60.0
    usage_mode: str = "Medium"

class ActivityEstimateResponse(BaseModel):
    energy_kwh: float
    co2_kg: float
    fuel_consumed_kg: Optional[float] = None
    emission_factor_used: float
    emission_factor_unit: str
    calculation_method: str
    effective_power_watts: float

class ActivityLogCreate(BaseModel):
    appliance_id: Optional[str] = None
    appliance_name: str
    category: str
    fuel_type: str = "electric"
    quantity: int = Field(default=1, ge=1)
    power_watts: float = Field(default=100.0, ge=0)
    duration_minutes: float = Field(..., ge=1)
    usage_mode: str = "Medium"
    activity_date: Optional[datetime.date] = None
    notes: Optional[str] = None

class ActivityLogResponse(BaseModel):
    id: str
    appliance_id: Optional[str] = None
    appliance_name: str
    category: str
    fuel_type: str
    quantity: int
    power_watts: float
    duration_minutes: float
    usage_mode: str
    activity_date: datetime.date
    logged_at: datetime.datetime
    energy_kwh: float
    co2_kg: float
    notes: Optional[str] = None

    class Config:
        from_attributes = True

# Rewards & Gamification
class RewardResponse(BaseModel):
    id: str
    title: str
    merchant: str
    category: str
    discount_text: str
    required_credits: int
    badge_color: str
    icon_name: str
    terms: str
    is_active: bool

    class Config:
        from_attributes = True

class RedeemRequest(BaseModel):
    reward_id: str

class RedemptionResponse(BaseModel):
    id: str
    reward_id: str
    reward_title: str
    merchant: str
    discount_text: str
    voucher_code: str
    credits_spent: int
    redeemed_at: datetime.datetime
    is_revealed: bool
    revealed_at: Optional[datetime.datetime] = None

# Leaderboard
class LeaderboardUser(BaseModel):
    rank: int
    user_id: str
    username: str
    full_name: str
    avatar_url: Optional[str] = None
    home_type: str
    household_members: int
    eco_score: float
    eco_credits: int
    current_streak: int
    daily_co2_actual_kg: float
    daily_co2_target_kg: float
    budget_adherence_percent: float
    badges: List[str] = []
    is_current_user: bool = False

# Dashboard aggregate
class DashboardResponse(BaseModel):
    user_info: Dict[str, Any]
    today_stats: Dict[str, Any]
    performance_vs_yesterday: Dict[str, Any]
    pie_chart_appliances: List[Dict[str, Any]]
    bar_chart_categories: List[Dict[str, Any]]
    line_chart_history: List[Dict[str, Any]]
    area_chart_energy: List[Dict[str, Any]]
    recent_activities: List[Dict[str, Any]]
    energy_saving_suggestions: List[Dict[str, Any]]
    gamification: Dict[str, Any]
