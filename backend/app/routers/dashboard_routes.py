import datetime
import uuid
from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from ..database import get_db
from ..models import User, Household, ActivityLog, DailyCarbonBudget, CreditTransaction, Appliance
from ..auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/")
def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    today = datetime.date.today()
    yesterday = today - datetime.timedelta(days=1)
    
    # Target from household
    daily_target_kg = current_user.household.daily_co2_target_kg if current_user.household else 12.5

    # Today's budget
    today_budget = db.query(DailyCarbonBudget).filter(
        DailyCarbonBudget.user_id == current_user.id,
        DailyCarbonBudget.date == today
    ).first()

    today_co2 = today_budget.actual_co2_kg if today_budget else 0.0
    today_kwh = today_budget.total_energy_kwh if today_budget else 0.0
    remaining_budget = round(max(0.0, daily_target_kg - today_co2), 2)
    budget_percent = round((today_co2 / daily_target_kg) * 100.0, 1) if daily_target_kg > 0 else 0.0

    status_color = "emerald"
    if budget_percent > 100:
        status_color = "red"
    elif budget_percent > 75:
        status_color = "amber"

    # Yesterday's budget for comparison
    yesterday_budget = db.query(DailyCarbonBudget).filter(
        DailyCarbonBudget.user_id == current_user.id,
        DailyCarbonBudget.date == yesterday
    ).first()

    yesterday_co2 = yesterday_budget.actual_co2_kg if yesterday_budget else 0.0
    yesterday_kwh = yesterday_budget.total_energy_kwh if yesterday_budget else 0.0

    co2_diff = round(today_co2 - yesterday_co2, 2)
    co2_diff_pct = round(((today_co2 - yesterday_co2) / yesterday_co2 * 100.0), 1) if yesterday_co2 > 0 else 0.0

    # Today's earned credits
    today_credits = db.query(func.sum(CreditTransaction.amount)).filter(
        CreditTransaction.user_id == current_user.id,
        CreditTransaction.amount > 0,
        func.date(CreditTransaction.created_at) == today
    ).scalar() or 0

    # Chart 1: Appliance-wise breakdown (all time or past 30 days)
    past_30d = today - datetime.timedelta(days=30)
    appliance_stats = db.query(
        ActivityLog.appliance_name,
        func.sum(ActivityLog.co2_kg).label("total_co2"),
        func.sum(ActivityLog.energy_kwh).label("total_kwh")
    ).filter(
        ActivityLog.user_id == current_user.id,
        ActivityLog.activity_date >= past_30d
    ).group_by(ActivityLog.appliance_name).order_by(desc("total_co2")).limit(8).all()

    pie_data = [
        {"name": a[0], "appliance_name": a[0], "value": round(a[1], 2), "co2": round(a[1], 2), "kwh": round(a[2], 2)}
        for a in appliance_stats
    ]

    # Chart 2: Category-wise emissions
    category_stats = db.query(
        ActivityLog.category,
        func.sum(ActivityLog.co2_kg).label("total_co2"),
        func.sum(ActivityLog.energy_kwh).label("total_kwh")
    ).filter(
        ActivityLog.user_id == current_user.id,
        ActivityLog.activity_date >= past_30d
    ).group_by(ActivityLog.category).order_by(desc("total_co2")).all()

    bar_data = [
        {"category": c[0], "name": c[0], "co2": round(c[1], 2), "value": round(c[1], 2), "kwh": round(c[2], 2)}
        for c in category_stats
    ]

    # Chart 3 & 4: Daily history for past 7 days (Line chart CO2 & Area chart kWh)
    history_days = []
    line_history = []
    area_energy = []
    
    for i in range(6, -1, -1):
        day_date = today - datetime.timedelta(days=i)
        day_str = day_date.strftime("%b %d")
        b = db.query(DailyCarbonBudget).filter(
            DailyCarbonBudget.user_id == current_user.id,
            DailyCarbonBudget.date == day_date
        ).first()

        co2_val = b.actual_co2_kg if b else 0.0
        kwh_val = b.total_energy_kwh if b else 0.0
        target_val = b.target_co2_kg if b else daily_target_kg

        line_history.append({
            "date": day_str,
            "actual_co2": round(co2_val, 2),
            "target_co2": round(target_val, 2)
        })
        area_energy.append({
            "date": day_str,
            "energy_kwh": round(kwh_val, 2)
        })

    # Recent activities (last 6)
    recent_logs = db.query(ActivityLog).filter(
        ActivityLog.user_id == current_user.id
    ).order_by(ActivityLog.logged_at.desc()).limit(6).all()

    recent_table = [
        {
            "id": l.id,
            "appliance_name": l.appliance_name,
            "category": l.category,
            "duration_minutes": l.duration_minutes,
            "usage_mode": l.usage_mode,
            "co2_kg": l.co2_kg,
            "energy_kwh": l.energy_kwh,
            "logged_at": l.logged_at.strftime("%I:%M %p"),
            "activity_date": l.activity_date.isoformat()
        }
        for l in recent_logs
    ]

    # Dynamic suggestions based on highest consuming appliances
    suggestions = [
        {
            "id": "1",
            "title": "Air Conditioner Optimization",
            "tip": "Running your AC at 24°C instead of 18°C saves 24% electricity daily and reduces monthly bills by ~₹850.",
            "impact": "Saves ~1.8 kg CO₂/day",
            "category": "Cooling"
        },
        {
            "id": "2",
            "title": "Smart Geyser Timing",
            "tip": "Switch off your water geyser right after 20 minutes of heating instead of leaving the thermostat on standby.",
            "impact": "Saves ~1.2 kg CO₂/day",
            "category": "Heating"
        },
        {
            "id": "3",
            "title": "Cover Cookware with Lids",
            "tip": "Trapping steam retains heat, allowing meals to cook up to 30% faster and directly conserving cooking fuel.",
            "impact": "Saves ~0.4 kg CO₂/day",
            "category": "Kitchen"
        },
        {
            "id": "4",
            "title": "Standby Vampire Load",
            "tip": "Unplug TVs, game consoles, and computer docks from power strips before going to sleep to eliminate idle draw.",
            "impact": "Saves ~0.6 kg CO₂/day",
            "category": "Electronics"
        }
    ]

    # Rank calculation on leaderboard
    all_users = db.query(User).order_by(desc(User.eco_score)).all()
    user_rank = 1
    for idx, u in enumerate(all_users):
        if u.id == current_user.id:
            user_rank = idx + 1
            break

    return {
        "user_info": {
            "full_name": current_user.full_name,
            "username": current_user.username,
            "eco_credits": current_user.eco_credits,
            "eco_score": current_user.eco_score,
            "current_streak": current_user.current_streak,
            "longest_streak": current_user.longest_streak,
            "leaderboard_rank": user_rank,
            "home_type": current_user.household.home_type if current_user.household else "2BHK",
            "household_members": current_user.household.household_members if current_user.household else 3
        },
        "today_stats": {
            "date": today.strftime("%A, %d %B %Y"),
            "today_co2_kg": round(today_co2, 2),
            "today_kwh": round(today_kwh, 2),
            "daily_target_kg": round(daily_target_kg, 2),
            "remaining_budget_kg": remaining_budget,
            "budget_percent_consumed": budget_percent,
            "status_color": status_color,
            "today_credits_earned": today_credits,
            "is_verified": today_budget.is_verified if today_budget else False,
            "activity_count": today_budget.activity_count if today_budget else 0
        },
        "performance_vs_yesterday": {
            "co2_diff_kg": co2_diff,
            "co2_diff_pct": co2_diff_pct,
            "is_lower_than_yesterday": co2_diff < 0,
            "yesterday_co2_kg": round(yesterday_co2, 2)
        },
        "charts": {
            "appliance_pie": pie_data,
            "category_bar": bar_data,
            "daily_history_line": line_history,
            "energy_trend_area": area_energy,
            "budget_progress_ring": {
                "consumed_pct": min(budget_percent, 100),
                "is_exceeded": budget_percent > 100,
                "current_kg": round(today_co2, 2),
                "target_kg": round(daily_target_kg, 2)
            }
        },
        "recent_activities": recent_table,
        "energy_saving_suggestions": suggestions
    }


@router.post("/verify-day")
def verify_day_tracking(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submits day as verified. If under budget and >= 2 activities logged,
    awards under-budget EcoCredits bonus.
    """
    today = datetime.date.today()
    budget = db.query(DailyCarbonBudget).filter(
        DailyCarbonBudget.user_id == current_user.id,
        DailyCarbonBudget.date == today
    ).first()

    if not budget or budget.activity_count < 2:
        raise HTTPException(
            status_code=400,
            detail="To verify your daily tracking, please log at least 2 household activities to ensure realistic completeness."
        )

    if budget.credits_awarded:
        return {
            "success": True,
            "already_claimed": True,
            "message": "Today's daily performance is already verified and rewarded!"
        }

    bonus = 0
    if budget.actual_co2_kg <= budget.target_co2_kg:
        bonus = 25  # Under budget bonus
        current_user.eco_credits += bonus
        tx = CreditTransaction(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            amount=bonus,
            transaction_type="under_budget",
            description=f"Stayed under daily carbon budget ({budget.actual_co2_kg} kg vs {budget.target_co2_kg} kg)"
        )
        db.add(tx)

    budget.is_verified = True
    budget.credits_awarded = True
    db.commit()

    return {
        "success": True,
        "message": "Daily carbon log successfully verified!",
        "bonus_credits_awarded": bonus,
        "new_balance": current_user.eco_credits
    }
