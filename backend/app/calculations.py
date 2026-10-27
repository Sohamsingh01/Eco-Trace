from .config import settings

def calculate_activity_emissions(
    fuel_type: str,
    power_watts: float,
    quantity: int,
    duration_minutes: float,
    usage_mode: str = "Medium"
) -> dict:
    """
    Calculates energy consumption and CO2 emissions based on appliance type,
    power rating, duration, and usage mode.
    
    Electricity Logic:
      kWh = (Power in Watts * Hours Used * Quantity * ModeMultiplier) / 1000
      CO2 (kg) = kWh * Electricity Emission Factor (default: 0.82 kg CO2/kWh)
      
    Gas Stove / LPG Logic:
      Fuel (kg LPG) = Duration (Hours) * Quantity * BurnerRate (0.15 kg/hr) * ModeMultiplier
      CO2 (kg) = Fuel (kg LPG) * LPG Emission Factor (2.983 kg CO2/kg LPG)
      Thermal kWh = Fuel (kg LPG) * 12.8 kWh/kg
    """
    hours = max(duration_minutes / 60.0, 0.0)
    qty = max(quantity, 1)
    
    # Mode multiplier for realistic compressor/heat cycle modulation
    mode = (usage_mode or "Medium").capitalize()
    mode_multipliers = {
        "Eco": 0.75,
        "Low": 0.70,
        "Medium": 1.00,
        "High": 1.30,
        "Turbo": 1.45
    }
    mode_factor = mode_multipliers.get(mode, 1.00)

    if fuel_type.lower() == "gas":
        # Separate fuel-based calculation - NO electrical watts used
        burners = qty
        lpg_consumption_kg = hours * burners * settings.LPG_KG_PER_HOUR_MEDIUM * mode_factor
        co2_emissions_kg = lpg_consumption_kg * settings.LPG_EMISSION_FACTOR_PER_KG
        equivalent_thermal_kwh = lpg_consumption_kg * 12.8 # 1 kg LPG ≈ 12.8 kWh thermal
        
        return {
            "energy_kwh": round(equivalent_thermal_kwh, 3),
            "co2_kg": round(co2_emissions_kg, 3),
            "fuel_consumed_kg": round(lpg_consumption_kg, 3),
            "emission_factor_used": settings.LPG_EMISSION_FACTOR_PER_KG,
            "emission_factor_unit": "kg CO2 / kg LPG",
            "calculation_method": "Fuel Stoichiometric Combustion (LPG)",
            "effective_power_watts": 0.0
        }
    else:
        # Standard electrical grid calculation
        effective_power = power_watts * mode_factor
        energy_kwh = (effective_power * hours * qty) / 1000.0
        co2_emissions_kg = energy_kwh * settings.ELECTRICITY_EMISSION_FACTOR
        
        return {
            "energy_kwh": round(energy_kwh, 3),
            "co2_kg": round(co2_emissions_kg, 3),
            "emission_factor_used": settings.ELECTRICITY_EMISSION_FACTOR,
            "emission_factor_unit": "kg CO2 / kWh",
            "calculation_method": "Grid Electricity CEA Factor",
            "effective_power_watts": round(effective_power, 1)
        }


def calculate_recommended_daily_budget(
    home_type: str,
    area_sqft: float,
    household_members: int,
    avg_hours_at_home: float,
    appliances_list: list = None
) -> dict:
    """
    Computes an estimated benchmark daily CO2 target for the household.
    Considers household size, approximate square footage, occupancy hours,
    and appliance inventory.
    """
    members = max(household_members, 1)
    sqft = max(area_sqft, 250.0)
    hours = min(max(avg_hours_at_home, 4.0), 24.0)

    # Baseline per capita allowance: 2.2 kg CO2 / person / day (efficient urban benchmark)
    per_person_kg = 2.2 * members
    
    # Area based baseline for space cooling/lighting/fan dispersion
    area_factor_kg = (sqft / 1000.0) * 2.5
    
    # Appliance inventory component
    appliance_factor_kg = 0.0
    if appliances_list:
        for app in appliances_list:
            qty = app.get("quantity", 1)
            watts = app.get("power_watts", 100.0)
            fuel = app.get("fuel_type", "electric")
            if fuel == "gas":
                appliance_factor_kg += 0.8 * qty
            else:
                # Assume ~2.5 hours average daily runtime for inventoried appliance
                kwh = (watts * qty * 2.5) / 1000.0
                appliance_factor_kg += kwh * settings.ELECTRICITY_EMISSION_FACTOR * 0.4
    else:
        # Fallback inventory estimate based on home size
        multiplier = {"1BHK": 3.0, "2BHK": 5.0, "3BHK": 7.5, "4BHK": 10.0}.get(home_type, 6.0)
        appliance_factor_kg = multiplier

    # Occupancy scaling factor (baseline 12 hours)
    occupancy_scaling = 0.75 + 0.25 * (hours / 14.0)

    total_recommended = (per_person_kg + area_factor_kg + appliance_factor_kg) * occupancy_scaling
    
    # Round to reasonable 1 decimal place with sensible bounds [4.0 kg to 35.0 kg]
    recommended_target = round(min(max(total_recommended, 4.0), 35.0), 1)

    return {
        "recommended_daily_target_kg": recommended_target,
        "per_capita_daily_target_kg": round(recommended_target / members, 2),
        "breakdown": {
            "household_members_allowance_kg": round(per_person_kg, 1),
            "area_allowance_kg": round(area_factor_kg, 1),
            "appliances_inventory_allowance_kg": round(appliance_factor_kg, 1),
            "occupancy_scaling_factor": round(occupancy_scaling, 2)
        },
        "disclaimer": "This benchmark is an estimated reference target modeled from your household parameters and regional CEA emission factors, designed to promote energy conservation."
    }


def calculate_ecoscore(
    budget_adherence_percent: float,
    current_streak: int,
    total_logs: int,
    household_members: int = 1
) -> float:
    """
    Computes household-normalized fair EcoScore (0 to 100):
    - 45% weight: Budget efficiency (adhering to or staying below target)
    - 30% weight: Tracking consistency & streaks
    - 25% weight: Activity completeness & engagement
    """
    # 1. Budget adherence score
    # 100% when logged emissions <= target
    if budget_adherence_percent <= 100:
        budget_score = 100.0 - (budget_adherence_percent * 0.1) # 90-100 range
    else:
        overshoot = budget_adherence_percent - 100
        budget_score = max(30.0, 90.0 - overshoot * 1.2)

    # 2. Streak / Consistency score (caps at 14 days for 100 pts)
    streak_score = min(current_streak / 14.0, 1.0) * 100.0

    # 3. Engagement score (logging volume, normalized for realistic activity)
    engagement_score = min(total_logs / 20.0, 1.0) * 100.0

    raw_score = (budget_score * 0.45) + (streak_score * 0.30) + (engagement_score * 0.25)
    
    # Ensure in realistic bounds [40.0 to 99.0]
    return round(min(max(raw_score, 40.0), 99.0), 1)
