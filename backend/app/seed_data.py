import uuid
import datetime
from sqlalchemy.orm import Session
from .models import Appliance, Reward, Achievement, User, Household, ActivityLog, DailyCarbonBudget, CreditTransaction
from .auth import hash_password
from .calculations import calculate_activity_emissions, calculate_ecoscore

DEFAULT_APPLIANCES = [
    {
        "name": "Air Conditioner (1.5 Ton 3-Star)",
        "category": "Cooling",
        "default_power_watts": 1500.0,
        "fuel_type": "electric",
        "icon_name": "Snowflake",
        "typical_daily_hours": 6.0,
        "energy_saving_tip": "Setting your AC temperature to 24°C instead of 18°C saves up to 24% electricity and significantly reduces compressor wear."
    },
    {
        "name": "Ceiling Fan (BLDC 5-Star)",
        "category": "Cooling",
        "default_power_watts": 35.0,
        "fuel_type": "electric",
        "icon_name": "Fan",
        "typical_daily_hours": 10.0,
        "energy_saving_tip": "BLDC fans consume 60% less power than standard induction fans while delivering the same airflow."
    },
    {
        "name": "Ceiling Fan (Standard)",
        "category": "Cooling",
        "default_power_watts": 75.0,
        "fuel_type": "electric",
        "icon_name": "Fan",
        "typical_daily_hours": 10.0,
        "energy_saving_tip": "Turning off fans when leaving an empty room prevents unnecessary baseline power drain."
    },
    {
        "name": "LED Lighting (Whole Room)",
        "category": "Lighting",
        "default_power_watts": 24.0,
        "fuel_type": "electric",
        "icon_name": "Lightbulb",
        "typical_daily_hours": 6.0,
        "energy_saving_tip": "LED bulbs use 80% less energy than old incandescent bulbs and last 25 times longer."
    },
    {
        "name": "Refrigerator (Double Door Frost-Free)",
        "category": "Kitchen",
        "default_power_watts": 200.0,
        "fuel_type": "electric",
        "icon_name": "Refrigerator",
        "typical_daily_hours": 24.0,
        "energy_saving_tip": "Keep refrigerator coils vacuumed and set the cooling dial to medium to optimize compressor cycles."
    },
    {
        "name": "Water Geyser (Storage Electric)",
        "category": "Heating",
        "default_power_watts": 2000.0,
        "fuel_type": "electric",
        "icon_name": "Flame",
        "typical_daily_hours": 1.0,
        "energy_saving_tip": "Switch off your geyser immediately after heating rather than leaving thermostat in continuous standby."
    },
    {
        "name": "Washing Machine (Front Load 7kg)",
        "category": "Laundry",
        "default_power_watts": 500.0,
        "fuel_type": "electric",
        "icon_name": "Waves",
        "typical_daily_hours": 1.0,
        "energy_saving_tip": "Washing with cold or 30°C water saves ~90% of laundry energy compared to hot water wash cycles."
    },
    {
        "name": "Microwave Oven",
        "category": "Kitchen",
        "default_power_watts": 1200.0,
        "fuel_type": "electric",
        "icon_name": "Microwave",
        "typical_daily_hours": 0.3,
        "energy_saving_tip": "Using a microwave to reheat portions uses 80% less energy than preheating a standard full-size oven."
    },
    {
        "name": "Induction Cooktop",
        "category": "Kitchen",
        "default_power_watts": 1800.0,
        "fuel_type": "electric",
        "icon_name": "Zap",
        "typical_daily_hours": 1.0,
        "energy_saving_tip": "Induction cooktops deliver 84% energy transfer efficiency compared to only 40% for conventional gas."
    },
    {
        "name": "Gas Stove (LPG Double Burner)",
        "category": "Kitchen",
        "default_power_watts": 0.0,  # Uses separate LPG mass calculation
        "fuel_type": "gas",
        "icon_name": "Flame",
        "typical_daily_hours": 1.5,
        "energy_saving_tip": "Always cover cooking pots with lids to cook 30% faster and conserve precious LPG fuel."
    },
    {
        "name": "Smart Television (55-inch 4K)",
        "category": "Entertainment",
        "default_power_watts": 120.0,
        "fuel_type": "electric",
        "icon_name": "Tv",
        "typical_daily_hours": 4.0,
        "energy_saving_tip": "Enable ambient light sensor mode to lower screen brightness and power draw during dark evening hours."
    },
    {
        "name": "Workstation / Laptop & Monitor",
        "category": "Electronics",
        "default_power_watts": 90.0,
        "fuel_type": "electric",
        "icon_name": "Laptop",
        "typical_daily_hours": 8.0,
        "energy_saving_tip": "Configure sleep timers after 10 minutes of inactivity and unplug external power bricks overnight."
    },
    {
        "name": "Water Purifier (RO + UV)",
        "category": "Kitchen",
        "default_power_watts": 45.0,
        "fuel_type": "electric",
        "icon_name": "Droplets",
        "typical_daily_hours": 2.0,
        "energy_saving_tip": "Regularly replace sediment filters to prevent pump strain and reduce electrical draw."
    }
]

DEFAULT_REWARDS = [
    {
        "title": "Nykaa ₹100 Off Coupon",
        "merchant": "Nykaa Beauty & Wellness",
        "category": "Shopping",
        "discount_text": "₹100 Off on orders above ₹499",
        "required_credits": 200,
        "badge_color": "emerald",
        "icon_name": "Sparkles",
        "terms": "Valid on eco-friendly cosmetic and personal care brands. Demo promotional code. Minimum cart ₹499.",
        "sample_code_prefix": "NYK-ECO"
    },
    {
        "title": "McDonald's ₹100 Off Voucher",
        "merchant": "McDonald's India",
        "category": "Food",
        "discount_text": "₹100 Off on McSaver Green Meals",
        "required_credits": 250,
        "badge_color": "limeAccent",
        "icon_name": "Utensils",
        "terms": "Valid on vegetarian and McPlant menus. Demo promotional voucher code for demonstration purposes.",
        "sample_code_prefix": "MCD-ECO"
    },
    {
        "title": "Amazon ₹50 Gift Voucher",
        "merchant": "Amazon Climate Pledge",
        "category": "Voucher",
        "discount_text": "₹50 Instant Pay Balance",
        "required_credits": 300,
        "badge_color": "forest",
        "icon_name": "Gift",
        "terms": "Applicable for Climate Pledge Friendly items and general store purchases. Simulated demonstration voucher.",
        "sample_code_prefix": "AMZ-ECO"
    },
    {
        "title": "Eco Warrior Digital Badge & Certificate",
        "merchant": "EcoTrace Foundation",
        "category": "Eco Swag",
        "discount_text": "Verified Green Citizen Status",
        "required_credits": 150,
        "badge_color": "emerald",
        "icon_name": "ShieldCheck",
        "terms": "Digital verifiable credentials celebrating verified sub-target carbon efficiency. Unlocks premium avatar frame.",
        "sample_code_prefix": "ECO-WARRIOR"
    },
    {
        "title": "Green Champion Recognition",
        "merchant": "Global Sustainability Club",
        "category": "Eco Swag",
        "discount_text": "Exclusive Hall of Fame Placement",
        "required_credits": 500,
        "badge_color": "limeAccent",
        "icon_name": "Award",
        "terms": "Unlocks top-tier profile flair and 1.2x streak credit multiplier for 30 days.",
        "sample_code_prefix": "ECO-CHAMP"
    },
    {
        "title": "Mystery EcoCredits Bonus Pack",
        "merchant": "EcoTrace Gamification",
        "category": "Bonus",
        "discount_text": "Win up to 400 EcoCredits!",
        "required_credits": 100,
        "badge_color": "forest",
        "icon_name": "HelpCircle",
        "terms": "Scratch to reveal a randomized bonus multiplier reward. Demonstration gamified prize.",
        "sample_code_prefix": "BONUS"
    },
    {
        "title": "KFC ₹150 Off Voucher",
        "merchant": "KFC India",
        "category": "Food",
        "discount_text": "₹150 Off on orders above ₹499",
        "required_credits": 220,
        "badge_color": "red",
        "icon_name": "Utensils",
        "terms": "Valid on all chicken buckets, zinger burgers, and rice bowls. Redeemable via KFC app or counter.",
        "sample_code_prefix": "KFC-ECO"
    },
    {
        "title": "The Souled Store 20% Off",
        "merchant": "The Souled Store",
        "category": "Shopping",
        "discount_text": "Flat 20% Off on Pop-Culture Merch",
        "required_credits": 180,
        "badge_color": "red",
        "icon_name": "ShoppingBag",
        "terms": "Valid on eco-cotton graphic tees, oversized hoodies, and fandom merchandise. No minimum cart.",
        "sample_code_prefix": "TSS-ECO"
    },
    {
        "title": "Myntra ₹300 Fashion Voucher",
        "merchant": "Myntra Fashion",
        "category": "Shopping",
        "discount_text": "Flat ₹300 Off on orders above ₹1,499",
        "required_credits": 280,
        "badge_color": "pink",
        "icon_name": "ShoppingBag",
        "terms": "Applicable across top apparel brands, sneakers, and sustainable collections on the Myntra app.",
        "sample_code_prefix": "MYN-ECO"
    },
    {
        "title": "H&M ₹250 Conscious Coupon",
        "merchant": "H&M Conscious",
        "category": "Shopping",
        "discount_text": "₹250 Off on Conscious Choice Line",
        "required_credits": 240,
        "badge_color": "red",
        "icon_name": "ShoppingBag",
        "terms": "Exclusive discount on garments made with at least 50% recycled or sustainable organic materials.",
        "sample_code_prefix": "HNM-ECO"
    },
    {
        "title": "Starbucks Free Beverage Upgrade",
        "merchant": "Starbucks Coffee",
        "category": "Food",
        "discount_text": "Free Size Upgrade + 10% Off on Tumblers",
        "required_credits": 160,
        "badge_color": "emerald",
        "icon_name": "Coffee",
        "terms": "Valid on all handcrafted beverages when you bring your personal reusable mug or tumbler.",
        "sample_code_prefix": "SBUX-ECO"
    },
    {
        "title": "Zara ₹500 Privilege Voucher",
        "merchant": "Zara Official",
        "category": "Shopping",
        "discount_text": "Flat ₹500 Off on Minimum Purchase ₹2,990",
        "required_credits": 350,
        "badge_color": "neutral",
        "icon_name": "ShoppingBag",
        "terms": "Valid in-store and online on all new arrivals, tailoring, and Join Life eco-certified collections.",
        "sample_code_prefix": "ZARA-ECO"
    },
    {
        "title": "PVR INOX 1+1 Cinema Ticket",
        "merchant": "PVR INOX Cinemas",
        "category": "Entertainment",
        "discount_text": "Buy 1 Get 1 Ticket Free on Weekdays",
        "required_credits": 200,
        "badge_color": "amber",
        "icon_name": "Film",
        "terms": "Valid on all 2D and 3D theatrical screenings Monday through Thursday at any PVR or INOX screen.",
        "sample_code_prefix": "PVR-ECO"
    },
    {
        "title": "Hamleys ₹300 Toy Voucher",
        "merchant": "Hamleys Toys",
        "category": "Shopping",
        "discount_text": "₹300 Off on Wooden & STEM Toys",
        "required_credits": 190,
        "badge_color": "red",
        "icon_name": "Gift",
        "terms": "Valid on wooden educational toys, plushies, and STEM learning games for minimum purchase ₹1,299.",
        "sample_code_prefix": "HML-ECO"
    },
    {
        "title": "BookMyShow ₹150 Live Voucher",
        "merchant": "BookMyShow",
        "category": "Entertainment",
        "discount_text": "₹150 Instant Discount on Concerts & Movies",
        "required_credits": 175,
        "badge_color": "rose",
        "icon_name": "Ticket",
        "terms": "Valid on live concerts, comedy shows, plays, and movie bookings with minimum booking of 2 tickets.",
        "sample_code_prefix": "BMS-ECO"
    },
    {
        "title": "MakeMyTrip ₹1,000 Travel Off",
        "merchant": "MakeMyTrip Holidays",
        "category": "Travel",
        "discount_text": "Flat ₹1,000 Off on Eco-Resorts & Flights",
        "required_credits": 450,
        "badge_color": "blue",
        "icon_name": "Plane",
        "terms": "Redeemable on certified green hotels, domestic flights, and eco-homestays across India.",
        "sample_code_prefix": "MMT-ECO"
    }
]

DEFAULT_ACHIEVEMENTS = [
    {
        "code": "FIRST_LOG",
        "title": "First Step",
        "description": "Log your first household appliance activity.",
        "icon_name": "Footprints",
        "category": "Logging",
        "required_value": 1,
        "credit_reward": 50
    },
    {
        "code": "STREAK_3",
        "title": "3-Day Green Streak",
        "description": "Log your household activities for 3 consecutive days.",
        "icon_name": "Flame",
        "category": "Streak",
        "required_value": 3,
        "credit_reward": 75
    },
    {
        "code": "STREAK_7",
        "title": "Week Champion",
        "description": "Maintain a continuous tracking streak for a full week.",
        "icon_name": "Zap",
        "category": "Streak",
        "required_value": 7,
        "credit_reward": 150
    },
    {
        "code": "BUDGET_SAVER",
        "title": "Carbon Budget Saver",
        "description": "Keep daily household emissions below your target for 3 days.",
        "icon_name": "ShieldCheck",
        "category": "Budget",
        "required_value": 3,
        "credit_reward": 100
    },
    {
        "code": "POWER_AUDITOR",
        "title": "Household Energy Master",
        "description": "Log at least 15 activities across different categories.",
        "icon_name": "Layers",
        "category": "Logging",
        "required_value": 15,
        "credit_reward": 200
    }
]

DEMO_LEADERBOARD_USERS = [
    {
        "name": "Priya Sharma",
        "username": "priya_green",
        "email": "priya@ecotrace.demo",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        "home_type": "2BHK",
        "area_sqft": 950,
        "city_state": "Bangalore, KA",
        "members": 3,
        "hours": 12.0,
        "target_kg": 11.2,
        "actual_today_kg": 7.4,
        "credits": 780,
        "streak": 14,
        "eco_score": 94.6,
        "badges": ["Eco Warrior", "7-Day Streak", "Solar Adopter"]
    },
    {
        "name": "Aarav Patel",
        "username": "aarav_p",
        "email": "aarav@ecotrace.demo",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        "home_type": "3BHK",
        "area_sqft": 1450,
        "city_state": "Ahmedabad, GJ",
        "members": 4,
        "hours": 14.0,
        "target_kg": 15.5,
        "actual_today_kg": 11.1,
        "credits": 640,
        "streak": 9,
        "eco_score": 91.2,
        "badges": ["Week Champion", "Budget Saver"]
    },
    {
        "name": "Ananya Sen",
        "username": "ananya_eco",
        "email": "ananya@ecotrace.demo",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        "home_type": "1BHK",
        "area_sqft": 600,
        "city_state": "Pune, MH",
        "members": 1,
        "hours": 10.0,
        "target_kg": 6.8,
        "actual_today_kg": 4.9,
        "credits": 590,
        "streak": 8,
        "eco_score": 89.8,
        "badges": ["Minimalist", "3-Day Streak"]
    },
    {
        "name": "Rohan Iyer",
        "username": "rohan_iyer",
        "email": "rohan@ecotrace.demo",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        "home_type": "2BHK",
        "area_sqft": 1100,
        "city_state": "Chennai, TN",
        "members": 2,
        "hours": 15.0,
        "target_kg": 10.5,
        "actual_today_kg": 8.9,
        "credits": 510,
        "streak": 6,
        "eco_score": 86.4,
        "badges": ["Budget Saver"]
    },
    {
        "name": "Vikram Malhotra",
        "username": "vikram_m",
        "email": "vikram@ecotrace.demo",
        "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        "home_type": "4BHK",
        "area_sqft": 2200,
        "city_state": "Gurugram, HR",
        "members": 5,
        "hours": 16.0,
        "target_kg": 22.0,
        "actual_today_kg": 19.5,
        "credits": 430,
        "streak": 5,
        "eco_score": 83.1,
        "badges": ["Family Champion"]
    }
]

def init_db_and_seed(db: Session):
    """
    Ensures preset appliances, standard rewards, achievements, and leaderboard demo users are seeded.
    """
    # 1. Seed Appliances
    if db.query(Appliance).count() == 0:
        for app_data in DEFAULT_APPLIANCES:
            app = Appliance(
                id=str(uuid.uuid4()),
                name=app_data["name"],
                category=app_data["category"],
                default_power_watts=app_data["default_power_watts"],
                fuel_type=app_data["fuel_type"],
                icon_name=app_data["icon_name"],
                is_custom=False,
                typical_daily_hours=app_data["typical_daily_hours"],
                energy_saving_tip=app_data["energy_saving_tip"]
            )
            db.add(app)
        db.commit()

    # 2. Seed Rewards (idempotent: check each reward by merchant)
    existing_merchants = {r.merchant for r in db.query(Reward.merchant).all()}
    for rew in DEFAULT_REWARDS:
        if rew["merchant"] not in existing_merchants:
            r = Reward(
                id=str(uuid.uuid4()),
                title=rew["title"],
                merchant=rew["merchant"],
                category=rew["category"],
                discount_text=rew["discount_text"],
                required_credits=rew["required_credits"],
                badge_color=rew["badge_color"],
                icon_name=rew["icon_name"],
                terms=rew["terms"],
                sample_code_prefix=rew["sample_code_prefix"],
                is_active=True
            )
            db.add(r)
    db.commit()

    # 3. Seed Achievements
    if db.query(Achievement).count() == 0:
        for ach in DEFAULT_ACHIEVEMENTS:
            a = Achievement(
                id=str(uuid.uuid4()),
                code=ach["code"],
                title=ach["title"],
                description=ach["description"],
                icon_name=ach["icon_name"],
                category=ach["category"],
                required_value=ach["required_value"],
                credit_reward=ach["credit_reward"]
            )
            db.add(a)
        db.commit()

    # 4. Seed Demo Leaderboard Competitors
    for demo in DEMO_LEADERBOARD_USERS:
        existing = db.query(User).filter(User.username == demo["username"]).first()
        if not existing:
            user_id = str(uuid.uuid4())
            u = User(
                id=user_id,
                email=demo["email"],
                password_hash=hash_password("DemoPassword123!"),
                full_name=demo["name"],
                username=demo["username"],
                avatar_url=demo["avatar"],
                onboarding_completed=True,
                eco_credits=demo["credits"],
                eco_score=demo["eco_score"],
                current_streak=demo["streak"],
                longest_streak=demo["streak"] + 2,
                last_active_date=datetime.date.today()
            )
            db.add(u)
            
            # Household
            h = Household(
                id=str(uuid.uuid4()),
                user_id=user_id,
                home_type=demo["home_type"],
                area_sqft=demo["area_sqft"],
                city_state=demo["city_state"],
                household_members=demo["members"],
                avg_hours_at_home=demo["hours"],
                daily_co2_target_kg=demo["target_kg"]
            )
            db.add(h)
            
            # Daily budget record for today
            today = datetime.date.today()
            b = DailyCarbonBudget(
                id=str(uuid.uuid4()),
                user_id=user_id,
                date=today,
                target_co2_kg=demo["target_kg"],
                actual_co2_kg=demo["actual_today_kg"],
                total_energy_kwh=round(demo["actual_today_kg"] / 0.82, 2),
                activity_count=4,
                is_verified=True,
                credits_awarded=True
            )
            db.add(b)
            
            # Add initial welcome transaction
            tx = CreditTransaction(
                id=str(uuid.uuid4()),
                user_id=user_id,
                amount=demo["credits"],
                transaction_type="community_reward",
                description="EcoTrace Community Benchmark Bonus"
            )
            db.add(tx)
            
            db.commit()
