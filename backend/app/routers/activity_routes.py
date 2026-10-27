import uuid
import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, ActivityLog, DailyCarbonBudget, CreditTransaction, Achievement, UserAchievement
from ..schemas import ActivityEstimateRequest, ActivityEstimateResponse, ActivityLogCreate, ActivityLogResponse
from ..auth import get_current_user
from ..calculations import calculate_activity_emissions, calculate_ecoscore

router = APIRouter(prefix="/activities", tags=["Activity Tracker"])

@router.post("/estimate", response_model=ActivityEstimateResponse)
def estimate_emissions(req: ActivityEstimateRequest):
    """
    Live calculation preview before saving.
    Distinguishes electrical grid calculations from fuel-based LPG stove calculations.
    """
    calc = calculate_activity_emissions(
        fuel_type=req.fuel_type,
        power_watts=req.power_watts,
        quantity=req.quantity,
        duration_minutes=req.duration_minutes,
        usage_mode=req.usage_mode
    )
    return calc


@router.post("/", response_model=dict)
def log_activity(
    payload: ActivityLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Logs an appliance activity, calculates emissions and energy,
    updates the daily budget summary, awards EcoCredits, and recalculates EcoScore.
    """
    calc = calculate_activity_emissions(
        fuel_type=payload.fuel_type,
        power_watts=payload.power_watts,
        quantity=payload.quantity,
        duration_minutes=payload.duration_minutes,
        usage_mode=payload.usage_mode
    )

    act_date = payload.activity_date or datetime.date.today()
    log_id = str(uuid.uuid4())

    new_log = ActivityLog(
        id=log_id,
        user_id=current_user.id,
        appliance_id=payload.appliance_id,
        appliance_name=payload.appliance_name,
        category=payload.category,
        fuel_type=payload.fuel_type,
        quantity=payload.quantity,
        power_watts=payload.power_watts,
        duration_minutes=payload.duration_minutes,
        usage_mode=payload.usage_mode,
        activity_date=act_date,
        logged_at=datetime.datetime.utcnow(),
        energy_kwh=calc["energy_kwh"],
        co2_kg=calc["co2_kg"],
        notes=payload.notes
    )
    db.add(new_log)

    # Update or create DailyCarbonBudget for that date
    budget = db.query(DailyCarbonBudget).filter(
        DailyCarbonBudget.user_id == current_user.id,
        DailyCarbonBudget.date == act_date
    ).first()

    target_kg = current_user.household.daily_co2_target_kg if current_user.household else 12.5

    if not budget:
        budget = DailyCarbonBudget(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            date=act_date,
            target_co2_kg=target_kg,
            actual_co2_kg=calc["co2_kg"],
            total_energy_kwh=calc["energy_kwh"],
            activity_count=1,
            is_verified=False
        )
        db.add(budget)
    else:
        budget.actual_co2_kg = round(budget.actual_co2_kg + calc["co2_kg"], 3)
        budget.total_energy_kwh = round(budget.total_energy_kwh + calc["energy_kwh"], 3)
        budget.activity_count += 1
        # Mark verified if >= 2 activities logged for the day
        if budget.activity_count >= 2:
            budget.is_verified = True

    # Award tracking credits (+10 EcoCredits)
    tracking_bonus = 10
    current_user.eco_credits += tracking_bonus
    tx = CreditTransaction(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        amount=tracking_bonus,
        transaction_type="activity_logged",
        description=f"Tracked activity: {payload.appliance_name}"
    )
    db.add(tx)

    # Check first log achievement
    first_ach = db.query(Achievement).filter(Achievement.code == "FIRST_LOG").first()
    unlocked_achievement = None
    if first_ach:
        already_has = db.query(UserAchievement).filter(
            UserAchievement.user_id == current_user.id,
            UserAchievement.achievement_id == first_ach.id
        ).first()
        if not already_has:
            ua = UserAchievement(
                id=str(uuid.uuid4()),
                user_id=current_user.id,
                achievement_id=first_ach.id,
                progress=100.0
            )
            db.add(ua)
            current_user.eco_credits += first_ach.credit_reward
            unlocked_achievement = {
                "title": first_ach.title,
                "reward": first_ach.credit_reward
            }

    # Recalculate Fair EcoScore
    total_logs = db.query(ActivityLog).filter(ActivityLog.user_id == current_user.id).count() + 1
    adherence_pct = (budget.actual_co2_kg / budget.target_co2_kg * 100.0) if budget.target_co2_kg > 0 else 50.0
    current_user.eco_score = calculate_ecoscore(
        budget_adherence_percent=adherence_pct,
        current_streak=current_user.current_streak,
        total_logs=total_logs,
        household_members=current_user.household.household_members if current_user.household else 1
    )

    db.commit()

    return {
        "success": True,
        "message": f"Logged {payload.appliance_name} successfully!",
        "log_id": log_id,
        "energy_kwh": calc["energy_kwh"],
        "co2_kg": calc["co2_kg"],
        "credits_earned": tracking_bonus,
        "new_balance": current_user.eco_credits,
        "unlocked_achievement": unlocked_achievement,
        "today_total_co2_kg": budget.actual_co2_kg,
        "today_target_kg": budget.target_co2_kg
    }


@router.get("/")
def get_activities(
    date: Optional[datetime.date] = None,
    category: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(ActivityLog).filter(ActivityLog.user_id == current_user.id)
    if date:
        query = query.filter(ActivityLog.activity_date == date)
    if category and category.lower() != "all":
        query = query.filter(ActivityLog.category == category)
        
    logs = query.order_by(ActivityLog.logged_at.desc()).limit(limit).all()

    return {
        "count": len(logs),
        "activities": [
            {
                "id": l.id,
                "appliance_name": l.appliance_name,
                "category": l.category,
                "fuel_type": l.fuel_type,
                "quantity": l.quantity,
                "power_watts": l.power_watts,
                "duration_minutes": l.duration_minutes,
                "usage_mode": l.usage_mode,
                "activity_date": l.activity_date.isoformat(),
                "logged_at": l.logged_at.isoformat(),
                "energy_kwh": l.energy_kwh,
                "co2_kg": l.co2_kg,
                "notes": l.notes
            }
            for l in logs
        ]
    }


@router.put("/{activity_id}")
def update_activity(
    activity_id: str,
    payload: ActivityLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    log = db.query(ActivityLog).filter(
        ActivityLog.id == activity_id,
        ActivityLog.user_id == current_user.id
    ).first()
    if not log:
        raise HTTPException(status_code=404, detail="Activity log not found.")

    calc = calculate_activity_emissions(
        fuel_type=payload.fuel_type,
        power_watts=payload.power_watts,
        quantity=payload.quantity,
        duration_minutes=payload.duration_minutes,
        usage_mode=payload.usage_mode
    )

    old_co2 = log.co2_kg
    old_kwh = log.energy_kwh

    log.appliance_name = payload.appliance_name
    log.category = payload.category
    log.fuel_type = payload.fuel_type
    log.quantity = payload.quantity
    log.power_watts = payload.power_watts
    log.duration_minutes = payload.duration_minutes
    log.usage_mode = payload.usage_mode
    log.notes = payload.notes
    log.energy_kwh = calc["energy_kwh"]
    log.co2_kg = calc["co2_kg"]

    # Adjust budget record
    budget = db.query(DailyCarbonBudget).filter(
        DailyCarbonBudget.user_id == current_user.id,
        DailyCarbonBudget.date == log.activity_date
    ).first()
    if budget:
        budget.actual_co2_kg = round(max(0.0, budget.actual_co2_kg - old_co2 + calc["co2_kg"]), 3)
        budget.total_energy_kwh = round(max(0.0, budget.total_energy_kwh - old_kwh + calc["energy_kwh"]), 3)

    db.commit()
    return {"success": True, "message": "Activity log updated successfully."}


@router.delete("/{activity_id}")
def delete_activity(
    activity_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    log = db.query(ActivityLog).filter(
        ActivityLog.id == activity_id,
        ActivityLog.user_id == current_user.id
    ).first()
    if not log:
        raise HTTPException(status_code=404, detail="Activity log not found.")

    budget = db.query(DailyCarbonBudget).filter(
        DailyCarbonBudget.user_id == current_user.id,
        DailyCarbonBudget.date == log.activity_date
    ).first()
    if budget:
        budget.actual_co2_kg = round(max(0.0, budget.actual_co2_kg - log.co2_kg), 3)
        budget.total_energy_kwh = round(max(0.0, budget.total_energy_kwh - log.energy_kwh), 3)
        budget.activity_count = max(0, budget.activity_count - 1)

    db.delete(log)
    db.commit()
    return {"success": True, "message": "Activity log deleted."}
