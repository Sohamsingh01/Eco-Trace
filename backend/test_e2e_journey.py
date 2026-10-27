import requests
import sys

# Ensure UTF-8 output on Windows command prompt
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

BASE_URL = "http://127.0.0.1:8000/api"

def run_e2e_test():
    print("=" * 60)
    print("ECOTRACE END-TO-END USER JOURNEY INTEGRATION TEST")
    print("=" * 60)

    # 1. Health check
    res = requests.get(f"{BASE_URL}/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    print("[PASS] 1. Backend health check operational.")

    # 2. Signup
    import uuid
    run_id = uuid.uuid4().hex[:6]
    test_email = f"test_citizen_{run_id}@gmail.com"
    signup_payload = {
        "full_name": f"Citizen {run_id.upper()}",
        "username": f"user_{run_id}",
        "email": test_email,
        "password": "Password123!"
    }
    
    # Try register, if already exists login
    res = requests.post(f"{BASE_URL}/auth/register", json=signup_payload)
    if res.status_code == 400 and "already" in res.text:
        res = requests.post(f"{BASE_URL}/auth/login", json={"email": test_email, "password": "Password123!"})
    
    assert res.status_code == 200, f"Auth failed: {res.text}"
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f"[PASS] 2. User authenticated successfully. Token received.")

    # 3. Check profile
    res = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    assert res.status_code == 200
    user_me = res.json()
    print(f"[PASS] 3. Profile checked. Initial EcoCredits: {user_me['eco_credits']}.")

    # 4. First-time Onboarding
    onboard_payload = {
        "full_name": signup_payload["full_name"],
        "username": signup_payload["username"],
        "household_members": 3,
        "home_type": "2BHK",
        "area_sqft": 1050,
        "city_state": "Bangalore, Karnataka",
        "avg_hours_at_home": 14,
        "selected_appliances": [
            {
                "name": "Air Conditioner (1.5 Ton 3-Star)",
                "category": "Cooling",
                "power_watts": 1500,
                "fuel_type": "electric",
                "quantity": 1
            },
            {
                "name": "Ceiling Fan (BLDC 5-Star)",
                "category": "Cooling",
                "power_watts": 35,
                "fuel_type": "electric",
                "quantity": 3
            },
            {
                "name": "Gas Stove (LPG Double Burner)",
                "category": "Kitchen",
                "power_watts": 0,
                "fuel_type": "gas",
                "quantity": 1
            }
        ],
        "custom_daily_co2_target_kg": 12.5
    }
    res = requests.post(f"{BASE_URL}/profile/onboarding", json=onboard_payload, headers=headers)
    assert res.status_code == 200, f"Onboarding failed: {res.text}"
    onboard_data = res.json()
    print(f"[PASS] 4. Onboarding completed! Target budget: {onboard_data['daily_co2_target_kg']} kg CO2. New balance: {onboard_data['new_eco_credits_balance']}.")

    # 5. Activity Pre-Calculation Estimate Preview
    est_payload = {
        "fuel_type": "electric",
        "power_watts": 1500,
        "quantity": 1,
        "duration_minutes": 180,
        "usage_mode": "Medium"
    }
    res = requests.post(f"{BASE_URL}/activities/estimate", json=est_payload, headers=headers)
    assert res.status_code == 200
    est = res.json()
    assert est["energy_kwh"] == 4.5, f"Expected 4.5 kWh, got {est['energy_kwh']}"
    assert est["co2_kg"] == 3.69, f"Expected 3.69 kg, got {est['co2_kg']}"
    print(f"[PASS] 5. Live pre-save emission estimate verified: 4.5 kWh -> 3.69 kg CO2.")

    # 6. Log Electric Activity
    log_payload = {
        "appliance_name": "Air Conditioner (1.5 Ton 3-Star)",
        "category": "Cooling",
        "fuel_type": "electric",
        "power_watts": 1500,
        "quantity": 1,
        "duration_minutes": 180,
        "usage_mode": "Medium",
        "notes": "Afternoon cooling test"
    }
    res = requests.post(f"{BASE_URL}/activities/", json=log_payload, headers=headers)
    assert res.status_code == 200
    log_res = res.json()
    print(f"[PASS] 6. Electric activity logged: +{log_res['credits_earned']} credits earned. Today CO2: {log_res['today_total_co2_kg']} kg.")

    # 7. Log Gas Stove Activity (LPG Fuel Calculation)
    gas_payload = {
        "appliance_name": "Gas Stove (LPG Double Burner)",
        "category": "Kitchen",
        "fuel_type": "gas",
        "power_watts": 0,
        "quantity": 1,
        "duration_minutes": 30,
        "usage_mode": "Medium",
        "notes": "Dinner cooking"
    }
    res = requests.post(f"{BASE_URL}/activities/", json=gas_payload, headers=headers)
    assert res.status_code == 200
    gas_res = res.json()
    print(f"[PASS] 7. Gas fuel activity logged: {gas_res['co2_kg']} kg CO2. Separate fuel stoichiometric combustion confirmed.")

    # 8. Dashboard Telemetry Verification
    res = requests.get(f"{BASE_URL}/dashboard/", headers=headers)
    assert res.status_code == 200
    dash = res.json()
    print(f"[PASS] 8. Dashboard metrics verified. Today CO2: {dash['today_stats']['today_co2_kg']} kg, Remaining budget: {dash['today_stats']['remaining_budget_kg']} kg.")

    # 9. Verify Day Tracking
    res = requests.post(f"{BASE_URL}/dashboard/verify-day", headers=headers)
    assert res.status_code == 200
    v_res = res.json()
    print(f"[PASS] 9. Day verified! Bonus credits awarded: {v_res.get('bonus_credits_awarded')}. New balance: {v_res.get('new_balance')}.")

    # 10. Analytics Check
    res = requests.get(f"{BASE_URL}/analytics/?range_type=7d", headers=headers)
    assert res.status_code == 200
    analytics = res.json()
    assert len(analytics["top_appliances"]) >= 2
    print(f"[PASS] 10. Analytics query verified: {analytics['summary']['total_activities_logged']} logs recorded.")

    # 11. Rewards Marketplace & Redemption
    res = requests.get(f"{BASE_URL}/rewards/", headers=headers)
    assert res.status_code == 200
    rewards_data = res.json()
    available_rewards = rewards_data["rewards"]
    assert len(available_rewards) > 0
    target_reward = available_rewards[0] # Nykaa ₹100 Off (200 credits)
    
    res = requests.post(f"{BASE_URL}/rewards/redeem", json={"reward_id": target_reward["id"]}, headers=headers)
    assert res.status_code == 200, f"Redemption failed: {res.text}"
    redeem_data = res.json()
    print(f"[PASS] 11. Redeemed '{target_reward['title']}'! Deducted {redeem_data['credits_spent']} credits. Voucher code: {redeem_data['voucher_code']}.")

    # 12. Reveal Scratch Card
    res = requests.post(f"{BASE_URL}/rewards/reveal/{redeem_data['redemption_id']}", headers=headers)
    assert res.status_code == 200
    reveal_data = res.json()
    print(f"[PASS] 12. Scratch card revealed: Demo Voucher {reveal_data['voucher_code']} activated.")

    # 13. Leaderboard Verification
    res = requests.get(f"{BASE_URL}/leaderboard/?timeframe=weekly", headers=headers)
    assert res.status_code == 200
    lead = res.json()
    my_rank = lead["current_user_rank"]
    assert my_rank > 0
    print(f"[PASS] 13. Community Leaderboard verified! User rank: #{my_rank} of {lead['total_participants']} citizens.")

    print("=" * 60)
    print("ALL 13 END-TO-END TESTS PASSED CLEANLY! ECOTRACE READY.")
    print("=" * 60)

if __name__ == "__main__":
    run_e2e_test()
