import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Household, Appliance, HouseholdAppliance, DailyCarbonBudget, CreditTransaction, Achievement, UserAchievement
from ..schemas import OnboardingSubmit, BudgetTargetUpdate, UserProfileUpdate
from ..auth import get_current_user, hash_password, verify_password
from ..calculations import calculate_recommended_daily_budget, calculate_ecoscore

router = APIRouter(prefix="/profile", tags=["Profile & Household"])

@router.get("/appliances/catalog")
def get_appliance_catalog(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Returns standard catalog plus user's custom appliances."""
    presets = db.query(Appliance).filter(Appliance.is_custom == False).all()
    user_customs = db.query(Appliance).filter(Appliance.user_id == current_user.id).all()
    
    return {
        "presets": [
            {
                "id": a.id,
                "name": a.name,
                "category": a.category,
                "default_power_watts": a.default_power_watts,
                "fuel_type": a.fuel_type,
                "icon_name": a.icon_name,
                "typical_daily_hours": a.typical_daily_hours,
                "energy_saving_tip": a.energy_saving_tip
            }
            for a in presets
        ],
        "custom": [
            {
                "id": a.id,
                "name": a.name,
                "category": a.category,
                "default_power_watts": a.default_power_watts,
                "fuel_type": a.fuel_type,
                "icon_name": a.icon_name,
                "typical_daily_hours": a.typical_daily_hours,
                "energy_saving_tip": a.energy_saving_tip
            }
            for a in user_customs
        ]
    }


@router.post("/appliances/custom")
def add_custom_appliance(
    payload: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    name = payload.get("name", "").strip()
    if not name:
        raise HTTPException(status_code=400, detail="Appliance name is required.")
    
    watts = float(payload.get("default_power_watts", 100.0))
    category = payload.get("category", "Other")
    fuel_type = payload.get("fuel_type", "electric")
    
    custom_app = Appliance(
        id=str(uuid.uuid4()),
        name=name,
        category=category,
        default_power_watts=watts,
        fuel_type=fuel_type,
        icon_name=payload.get("icon_name", "Zap"),
        is_custom=True,
        user_id=current_user.id,
        typical_daily_hours=float(payload.get("typical_daily_hours", 2.0)),
        energy_saving_tip="Regular maintenance and unplugging unused appliances saves standby power."
    )
    db.add(custom_app)
    db.commit()
    db.refresh(custom_app)
    
    return {
        "id": custom_app.id,
        "name": custom_app.name,
        "category": custom_app.category,
        "default_power_watts": custom_app.default_power_watts,
        "fuel_type": custom_app.fuel_type,
        "icon_name": custom_app.icon_name,
        "is_custom": True
    }


@router.post("/onboarding")
def complete_onboarding(
    payload: OnboardingSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Saves Step 1 (User), Step 2 (Household), Step 3 (Appliances), and Step 4 (Carbon Budget).
    """
    # 1. Update user info
    current_user.full_name = payload.full_name.strip()
    desired_uname = payload.username.lower().strip()
    if desired_uname != current_user.username:
        existing_u = db.query(User).filter(User.username == desired_uname, User.id != current_user.id).first()
        if not existing_u:
            current_user.username = desired_uname
    current_user.onboarding_completed = True

    # 2. Compute benchmark budget
    appliances_data = [
        {"quantity": a.quantity, "power_watts": a.power_watts, "fuel_type": a.fuel_type}
        for a in payload.selected_appliances
    ]
    budget_calc = calculate_recommended_daily_budget(
        home_type=payload.home_type,
        area_sqft=payload.area_sqft,
        household_members=payload.household_members,
        avg_hours_at_home=payload.avg_hours_at_home,
        appliances_list=appliances_data
    )
    
    target_kg = payload.custom_daily_co2_target_kg or budget_calc["recommended_daily_target_kg"]

    # 3. Create or update household
    household = db.query(Household).filter(Household.user_id == current_user.id).first()
    if not household:
        household = Household(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            home_type=payload.home_type,
            area_sqft=payload.area_sqft,
            city_state=payload.city_state,
            household_members=payload.household_members,
            avg_hours_at_home=payload.avg_hours_at_home,
            daily_co2_target_kg=target_kg
        )
        db.add(household)
        db.flush()
    else:
        household.home_type = payload.home_type
        household.area_sqft = payload.area_sqft
        household.city_state = payload.city_state
        household.household_members = payload.household_members
        household.avg_hours_at_home = payload.avg_hours_at_home
        household.daily_co2_target_kg = target_kg

    # 4. Save household appliances
    # Clear previous
    db.query(HouseholdAppliance).filter(HouseholdAppliance.household_id == household.id).delete()
    for item in payload.selected_appliances:
        # Resolve appliance id
        app_id = item.appliance_id
        if not app_id:
            # Check if preset exists by name
            existing_app = db.query(Appliance).filter(Appliance.name == item.name).first()
            if existing_app:
                app_id = existing_app.id
            else:
                # Create custom
                new_app = Appliance(
                    id=str(uuid.uuid4()),
                    name=item.name,
                    category=item.category,
                    default_power_watts=item.power_watts,
                    fuel_type=item.fuel_type,
                    icon_name="Zap",
                    is_custom=True,
                    user_id=current_user.id
                )
                db.add(new_app)
                db.flush()
                app_id = new_app.id

        ha = HouseholdAppliance(
            id=str(uuid.uuid4()),
            household_id=household.id,
            appliance_id=app_id,
            quantity=item.quantity,
            power_watts=item.power_watts
        )
        db.add(ha)

    # 5. Initialize or update today's budget
    today = datetime.date.today()
    today_budget = db.query(DailyCarbonBudget).filter(
        DailyCarbonBudget.user_id == current_user.id,
        DailyCarbonBudget.date == today
    ).first()
    if not today_budget:
        today_budget = DailyCarbonBudget(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            date=today,
            target_co2_kg=target_kg,
            actual_co2_kg=0.0,
            total_energy_kwh=0.0,
            activity_count=0,
            is_verified=False
        )
        db.add(today_budget)
    else:
        today_budget.target_co2_kg = target_kg

    # 6. Reward onboarding completion bonus (+50 credits)
    onboard_bonus = 50
    current_user.eco_credits += onboard_bonus
    tx = CreditTransaction(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        amount=onboard_bonus,
        transaction_type="onboarding_bonus",
        description="Household Onboarding Completion Reward"
    )
    db.add(tx)

    db.commit()
    db.refresh(current_user)

    return {
        "success": True,
        "message": "Household onboarding completed successfully!",
        "daily_co2_target_kg": target_kg,
        "credits_awarded": onboard_bonus,
        "new_eco_credits_balance": current_user.eco_credits,
        "benchmark_details": budget_calc
    }


@router.get("/household")
def get_household(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    h = db.query(Household).filter(Household.user_id == current_user.id).first()
    if not h:
        return {"household": None}

    appliances = []
    for ha in h.appliances:
        if ha.appliance:
            appliances.append({
                "id": ha.id,
                "appliance_id": ha.appliance.id,
                "name": ha.appliance.name,
                "category": ha.appliance.category,
                "fuel_type": ha.appliance.fuel_type,
                "quantity": ha.quantity,
                "power_watts": ha.power_watts,
                "icon_name": ha.appliance.icon_name,
                "energy_saving_tip": ha.appliance.energy_saving_tip
            })

    return {
        "household": {
            "id": h.id,
            "home_type": h.home_type,
            "area_sqft": h.area_sqft,
            "city_state": h.city_state,
            "household_members": h.household_members,
            "avg_hours_at_home": h.avg_hours_at_home,
            "daily_co2_target_kg": h.daily_co2_target_kg,
            "appliances": appliances
        }
    }


@router.put("/budget-target")
def update_budget_target(
    payload: BudgetTargetUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    h = db.query(Household).filter(Household.user_id == current_user.id).first()
    if not h:
        raise HTTPException(status_code=400, detail="Household profile not found. Please complete onboarding first.")
    
    h.daily_co2_target_kg = round(payload.daily_co2_target_kg, 1)
    
    # Update today's budget target as well
    today = datetime.date.today()
    today_budget = db.query(DailyCarbonBudget).filter(
        DailyCarbonBudget.user_id == current_user.id,
        DailyCarbonBudget.date == today
    ).first()
    if today_budget:
        today_budget.target_co2_kg = h.daily_co2_target_kg

    db.commit()
    return {
        "success": True,
        "daily_co2_target_kg": h.daily_co2_target_kg,
        "message": "Daily carbon budget target updated successfully."
    }


@router.put("/settings")
def update_settings(
    payload: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if payload.full_name:
        current_user.full_name = payload.full_name.strip()
    if payload.username:
        # Check uniqueness if changed
        desired = payload.username.lower().strip()
        if desired != current_user.username:
            existing = db.query(User).filter(User.username == desired).first()
            if existing:
                raise HTTPException(status_code=400, detail="Username is already in use.")
            current_user.username = desired
    if payload.avatar_url:
        current_user.avatar_url = payload.avatar_url.strip()

    # Password change
    if payload.new_password:
        if not payload.current_password or not verify_password(payload.current_password, current_user.password_hash):
            raise HTTPException(status_code=400, detail="Current password verification failed.")
        current_user.password_hash = hash_password(payload.new_password)

    db.commit()
    db.refresh(current_user)
    return {
        "success": True,
        "message": "Profile settings updated successfully.",
        "user": {
            "id": current_user.id,
            "email": current_user.email,
            "full_name": current_user.full_name,
            "username": current_user.username,
            "avatar_url": current_user.avatar_url,
            "eco_credits": current_user.eco_credits,
            "eco_score": current_user.eco_score
        }
    }


@router.get("/achievements")
def get_user_achievements(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    all_achievements = db.query(Achievement).all()
    user_unlocked = {ua.achievement_id: ua for ua in db.query(UserAchievement).filter(UserAchievement.user_id == current_user.id).all()}
    
    total_logs = len(current_user.activity_logs)
    
    result = []
    for a in all_achievements:
        is_unlocked = a.id in user_unlocked
        progress = 100.0 if is_unlocked else 0.0
        
        # Calculate dynamic progress
        if not is_unlocked:
            if a.category == "Streak":
                progress = min(round((current_user.current_streak / a.required_value) * 100, 1), 100.0)
            elif a.category == "Logging":
                progress = min(round((total_logs / a.required_value) * 100, 1), 100.0)
            elif a.category == "Budget":
                progress = 50.0

        result.append({
            "id": a.id,
            "code": a.code,
            "title": a.title,
            "description": a.description,
            "icon_name": a.icon_name,
            "category": a.category,
            "credit_reward": a.credit_reward,
            "is_unlocked": is_unlocked,
            "progress_percent": progress
        })

    return {"achievements": result}


@router.put("/household")
def update_household(
    payload: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    h = db.query(Household).filter(Household.user_id == current_user.id).first()
    if not h:
        raise HTTPException(status_code=400, detail="Household profile not found.")
    
    if "home_type" in payload and payload["home_type"]:
        h.home_type = payload["home_type"]
    if "household_members" in payload and payload["household_members"] is not None:
        h.household_members = int(payload["household_members"])
    if "area_sqft" in payload and payload["area_sqft"] is not None:
        h.area_sqft = float(payload["area_sqft"])
    if "city_state" in payload and payload["city_state"]:
        h.city_state = payload["city_state"]
    if "daily_co2_target_kg" in payload and payload["daily_co2_target_kg"] is not None:
        h.daily_co2_target_kg = float(payload["daily_co2_target_kg"])
    
    db.commit()
    db.refresh(h)
    return {"success": True, "message": "Household parameters updated successfully.", "household_id": h.id}


@router.post("/household/appliances")
def add_household_appliance(
    payload: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    h = db.query(Household).filter(Household.user_id == current_user.id).first()
    if not h:
        raise HTTPException(status_code=400, detail="Household profile not found.")
    
    app_id = payload.get("appliance_id")
    name = payload.get("name", "Custom Appliance").strip()
    category = payload.get("category", "Other")
    fuel_type = payload.get("fuel_type", "electric")
    power = float(payload.get("power_watts", 100))
    quantity = int(payload.get("quantity", 1))

    if not app_id:
        # Create appliance entry if not exists
        new_app = Appliance(
            id=str(uuid.uuid4()),
            name=name,
            category=category,
            default_power_watts=power,
            fuel_type=fuel_type,
            icon_name="Zap",
            is_custom=True,
            user_id=current_user.id
        )
        db.add(new_app)
        db.flush()
        app_id = new_app.id

    ha = HouseholdAppliance(
        id=str(uuid.uuid4()),
        household_id=h.id,
        appliance_id=app_id,
        quantity=quantity,
        power_watts=power
    )
    db.add(ha)
    db.commit()
    return {"success": True, "message": f"{name} added to household inventory.", "id": ha.id}


@router.delete("/household/appliances/{ha_id}")
def delete_household_appliance(
    ha_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    h = db.query(Household).filter(Household.user_id == current_user.id).first()
    if not h:
        raise HTTPException(status_code=400, detail="Household profile not found.")
    
    ha = db.query(HouseholdAppliance).filter(
        HouseholdAppliance.id == ha_id,
        HouseholdAppliance.household_id == h.id
    ).first()
    if ha:
        db.delete(ha)
        db.commit()
    return {"success": True, "message": "Appliance removed from inventory."}

