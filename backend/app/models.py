import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "profiles"

    id = Column(String(36), primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    avatar_url = Column(String(500), nullable=True)
    onboarding_completed = Column(Boolean, default=False)
    
    # Gamification stats
    eco_credits = Column(Integer, default=150)  # Initial welcome gift
    eco_score = Column(Float, default=78.5)      # Initial baseline score
    current_streak = Column(Integer, default=1)
    longest_streak = Column(Integer, default=1)
    last_active_date = Column(Date, default=datetime.date.today)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    household = relationship("Household", back_populates="user", uselist=False, cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLog", back_populates="user", cascade="all, delete-orphan")
    daily_budgets = relationship("DailyCarbonBudget", back_populates="user", cascade="all, delete-orphan")
    credit_transactions = relationship("CreditTransaction", back_populates="user", cascade="all, delete-orphan")
    redemptions = relationship("Redemption", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")


class Household(Base):
    __tablename__ = "households"

    id = Column(String(36), primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, unique=True)
    
    home_type = Column(String(50), default="2BHK")  # 1BHK, 2BHK, 3BHK, 4BHK, Villa, Other
    area_sqft = Column(Float, default=1000.0)
    city_state = Column(String(200), default="Bangalore, Karnataka")
    household_members = Column(Integer, default=3)
    avg_hours_at_home = Column(Float, default=14.0)
    
    # Calculated benchmark budget
    daily_co2_target_kg = Column(Float, default=12.5)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="household")
    appliances = relationship("HouseholdAppliance", back_populates="household", cascade="all, delete-orphan")


class Appliance(Base):
    __tablename__ = "appliances"

    id = Column(String(36), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)  # Cooling, Heating, Kitchen, Lighting, Entertainment, Laundry, Electronics, Other
    default_power_watts = Column(Float, default=100.0)
    fuel_type = Column(String(20), default="electric")  # electric, gas
    icon_name = Column(String(50), default="Zap")
    is_custom = Column(Boolean, default=False)
    user_id = Column(String(36), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=True)
    typical_daily_hours = Column(Float, default=2.0)
    energy_saving_tip = Column(String(500), nullable=True)


class HouseholdAppliance(Base):
    __tablename__ = "household_appliances"

    id = Column(String(36), primary_key=True, index=True)
    household_id = Column(String(36), ForeignKey("households.id", ondelete="CASCADE"), nullable=False)
    appliance_id = Column(String(36), ForeignKey("appliances.id", ondelete="CASCADE"), nullable=False)
    quantity = Column(Integer, default=1)
    power_watts = Column(Float, default=100.0)
    
    household = relationship("Household", back_populates="appliances")
    appliance = relationship("Appliance")


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(String(36), primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    appliance_id = Column(String(36), ForeignKey("appliances.id", ondelete="SET NULL"), nullable=True)
    
    appliance_name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    fuel_type = Column(String(20), default="electric")
    
    quantity = Column(Integer, default=1)
    power_watts = Column(Float, default=100.0)
    duration_minutes = Column(Float, default=60.0)
    usage_mode = Column(String(50), default="Medium")  # Low, Medium, High, Eco, etc.
    
    activity_date = Column(Date, default=datetime.date.today, index=True)
    logged_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Calculated values
    energy_kwh = Column(Float, default=0.0)
    co2_kg = Column(Float, default=0.0)
    notes = Column(Text, nullable=True)
    
    user = relationship("User", back_populates="activity_logs")
    appliance = relationship("Appliance")


class DailyCarbonBudget(Base):
    __tablename__ = "daily_carbon_budgets"

    id = Column(String(36), primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    
    target_co2_kg = Column(Float, default=12.5)
    actual_co2_kg = Column(Float, default=0.0)
    total_energy_kwh = Column(Float, default=0.0)
    activity_count = Column(Integer, default=0)
    
    is_verified = Column(Boolean, default=False)  # Requires >= 2 logs or user explicit day submit
    credits_awarded = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="daily_budgets")


class CreditTransaction(Base):
    __tablename__ = "credit_transactions"

    id = Column(String(36), primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    amount = Column(Integer, nullable=False)  # positive for earned, negative for spent
    transaction_type = Column(String(50), nullable=False)  # welcome_bonus, activity_logged, under_budget, streak_bonus, challenge, reward_redeemed
    description = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="credit_transactions")


class Reward(Base):
    __tablename__ = "rewards"

    id = Column(String(36), primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    merchant = Column(String(100), nullable=False)
    category = Column(String(50), default="Voucher")  # Shopping, Food, Lifestyle, Eco Swag, Bonus
    discount_text = Column(String(100), nullable=False)  # ₹100 Off, 15% Off, Free Tree Sapling
    required_credits = Column(Integer, nullable=False)
    badge_color = Column(String(50), default="emerald")
    icon_name = Column(String(50), default="Gift")
    terms = Column(String(500), nullable=False)
    sample_code_prefix = Column(String(20), default="ECO")
    is_active = Column(Boolean, default=True)


class Redemption(Base):
    __tablename__ = "redemptions"

    id = Column(String(36), primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    reward_id = Column(String(36), ForeignKey("rewards.id", ondelete="CASCADE"), nullable=False)
    credits_spent = Column(Integer, nullable=False)
    voucher_code = Column(String(100), nullable=False)
    redeemed_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_revealed = Column(Boolean, default=False)
    revealed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="redemptions")
    reward = relationship("Reward")


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(String(36), primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)
    icon_name = Column(String(50), default="Award")
    category = Column(String(50), default="Streak")  # Streak, Budget, Logging, Milestone
    required_value = Column(Integer, default=1)
    credit_reward = Column(Integer, default=50)


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(String(36), primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    achievement_id = Column(String(36), ForeignKey("achievements.id", ondelete="CASCADE"), nullable=False)
    unlocked_at = Column(DateTime, default=datetime.datetime.utcnow)
    progress = Column(Float, default=100.0)

    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement")
