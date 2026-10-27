import datetime
import io
import csv
from typing import Optional
from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from ..database import get_db
from ..models import User, ActivityLog, DailyCarbonBudget
from ..auth import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/")
def get_analytics(
    range_type: str = Query("7d", pattern="^(today|7d|30d|year|custom)$"),
    start_date: Optional[datetime.date] = None,
    end_date: Optional[datetime.date] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    today = datetime.date.today()
    if range_type == "today":
        start = today
        end = today
    elif range_type == "7d":
        start = today - datetime.timedelta(days=7)
        end = today
    elif range_type == "30d":
        start = today - datetime.timedelta(days=30)
        end = today
    elif range_type == "year":
        start = today - datetime.timedelta(days=365)
        end = today
    else:
        start = start_date or (today - datetime.timedelta(days=7))
        end = end_date or today

    # Logs in range
    logs_query = db.query(ActivityLog).filter(
        ActivityLog.user_id == current_user.id,
        ActivityLog.activity_date >= start,
        ActivityLog.activity_date <= end
    )
    logs = logs_query.all()

    total_co2 = round(sum(l.co2_kg for l in logs), 2)
    total_kwh = round(sum(l.energy_kwh for l in logs), 2)
    total_activities = len(logs)
    
    # Calculate days count in range
    days_span = max((end - start).days + 1, 1)
    avg_daily_co2 = round(total_co2 / days_span, 2)
    avg_daily_kwh = round(total_kwh / days_span, 2)

    # Time series daily points
    point_map = {}
    curr = start
    while curr <= end:
        point_map[curr] = {"co2": 0.0, "kwh": 0.0, "count": 0}
        curr += datetime.timedelta(days=1)

    for l in logs:
        if l.activity_date in point_map:
            point_map[l.activity_date]["co2"] += l.co2_kg
            point_map[l.activity_date]["kwh"] += l.energy_kwh
            point_map[l.activity_date]["count"] += 1

    daily_series = [
        {
            "date": d.strftime("%b %d"),
            "full_date": d.isoformat(),
            "co2_kg": round(data["co2"], 2),
            "energy_kwh": round(data["kwh"], 2),
            "logs_count": data["count"]
        }
        for d, data in sorted(point_map.items())
    ]

    # Top consuming appliances
    appliance_groups = {}
    for l in logs:
        name = l.appliance_name
        if name not in appliance_groups:
            appliance_groups[name] = {"category": l.category, "co2": 0.0, "kwh": 0.0, "minutes": 0.0, "count": 0}
        appliance_groups[name]["co2"] += l.co2_kg
        appliance_groups[name]["kwh"] += l.energy_kwh
        appliance_groups[name]["minutes"] += l.duration_minutes
        appliance_groups[name]["count"] += 1

    top_appliances = [
        {
            "name": name,
            "category": val["category"],
            "co2_kg": round(val["co2"], 2),
            "energy_kwh": round(val["kwh"], 2),
            "total_hours": round(val["minutes"] / 60.0, 1),
            "usage_count": val["count"],
            "share_percent": round((val["co2"] / total_co2 * 100), 1) if total_co2 > 0 else 0
        }
        for name, val in sorted(appliance_groups.items(), key=lambda x: x[1]["co2"], reverse=True)
    ]

    # Category distribution
    cat_groups = {}
    for l in logs:
        cat = l.category
        if cat not in cat_groups:
            cat_groups[cat] = {"co2": 0.0, "kwh": 0.0}
        cat_groups[cat]["co2"] += l.co2_kg
        cat_groups[cat]["kwh"] += l.energy_kwh

    category_breakdown = [
        {
            "category": cat,
            "co2_kg": round(data["co2"], 2),
            "energy_kwh": round(data["kwh"], 2),
            "percent": round((data["co2"] / total_co2 * 100), 1) if total_co2 > 0 else 0
        }
        for cat, data in sorted(cat_groups.items(), key=lambda x: x[1]["co2"], reverse=True)
    ]

    # Budget comparisons
    target_kg = current_user.household.daily_co2_target_kg if current_user.household else 12.5
    under_budget_days = sum(1 for d in daily_series if d["co2_kg"] <= target_kg)
    over_budget_days = sum(1 for d in daily_series if d["co2_kg"] > target_kg)

    return {
        "range_type": range_type,
        "start_date": start.isoformat(),
        "end_date": end.isoformat(),
        "days_in_period": days_span,
        "summary": {
            "total_co2_kg": total_co2,
            "total_energy_kwh": total_kwh,
            "avg_daily_co2_kg": avg_daily_co2,
            "avg_daily_kwh": avg_daily_kwh,
            "total_activities_logged": total_activities,
            "daily_target_kg": target_kg,
            "under_budget_days": under_budget_days,
            "over_budget_days": over_budget_days
        },
        "daily_series": daily_series,
        "top_appliances": top_appliances,
        "category_breakdown": category_breakdown
    }


@router.get("/export-csv")
def export_activity_csv(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Exports all tracked activity logs as a downloadable CSV.
    """
    logs = db.query(ActivityLog).filter(
        ActivityLog.user_id == current_user.id
    ).order_by(ActivityLog.activity_date.desc(), ActivityLog.logged_at.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Activity ID",
        "Date",
        "Time",
        "Appliance Name",
        "Category",
        "Fuel Type",
        "Quantity",
        "Power (Watts)",
        "Duration (Minutes)",
        "Operating Mode",
        "Calculated Energy (kWh)",
        "Estimated CO2 (kg)",
        "Notes"
    ])

    for l in logs:
        writer.writerow([
            l.id,
            l.activity_date.isoformat(),
            l.logged_at.strftime("%H:%M:%S"),
            l.appliance_name,
            l.category,
            l.fuel_type,
            l.quantity,
            l.power_watts,
            l.duration_minutes,
            l.usage_mode,
            l.energy_kwh,
            l.co2_kg,
            l.notes or ""
        ])

    csv_content = output.getvalue()
    filename = f"ecotrace_activities_{current_user.username}_{datetime.date.today().isoformat()}.csv"
    
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
