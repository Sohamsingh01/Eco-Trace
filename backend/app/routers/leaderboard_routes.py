import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from ..database import get_db
from ..models import User, Household, DailyCarbonBudget, UserAchievement
from ..auth import get_current_user

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])

@router.get("/")
def get_leaderboard(
    timeframe: str = Query("weekly", pattern="^(global|weekly|monthly)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch all users ordered by EcoScore descending
    all_users = db.query(User).order_by(desc(User.eco_score)).all()
    today = datetime.date.today()

    leaderboard_list = []
    user_position = 1

    for idx, u in enumerate(all_users):
        rank = idx + 1
        is_me = (u.id == current_user.id)
        if is_me:
            user_position = rank

        # Fetch today's budget or default
        b = db.query(DailyCarbonBudget).filter(
            DailyCarbonBudget.user_id == u.id,
            DailyCarbonBudget.date == today
        ).first()

        actual_kg = b.actual_co2_kg if b else 0.0
        target_kg = b.target_co2_kg if b else (u.household.daily_co2_target_kg if u.household else 12.0)
        adherence = round((actual_kg / target_kg * 100), 1) if target_kg > 0 else 50.0

        # Badges list
        badges = []
        if u.current_streak >= 7:
            badges.append("7-Day Streak")
        elif u.current_streak >= 3:
            badges.append("3-Day Streak")
            
        if u.eco_score >= 90:
            badges.append("Eco Master")
        elif u.eco_score >= 80:
            badges.append("Carbon Saver")

        if u.household and u.household.household_members >= 4:
            badges.append("Green Family")

        entry = {
            "rank": rank,
            "user_id": u.id,
            "username": u.username,
            "full_name": u.full_name,
            "avatar_url": u.avatar_url,
            "home_type": u.household.home_type if u.household else "2BHK",
            "household_members": u.household.household_members if u.household else 2,
            "eco_score": round(u.eco_score, 1),
            "eco_credits": u.eco_credits,
            "current_streak": u.current_streak,
            "daily_co2_actual_kg": round(actual_kg, 2),
            "daily_co2_target_kg": round(target_kg, 2),
            "budget_adherence_percent": adherence,
            "badges": badges,
            "is_current_user": is_me
        }
        leaderboard_list.append(entry)

    # Top 3 Podium
    podium = leaderboard_list[:3]

    return {
        "timeframe": timeframe,
        "current_user_rank": user_position,
        "total_participants": len(leaderboard_list),
        "podium": podium,
        "rankings": leaderboard_list
    }
