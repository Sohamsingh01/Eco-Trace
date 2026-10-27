import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, CreditTransaction
from ..schemas import UserRegister, UserLogin, TokenResponse, ForgotPasswordRequest, UserProfileResponse
from ..auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    # Check if email exists
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email is already registered.")
    
    # Check if username exists
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(status_code=400, detail="Username is already taken.")

    user_id = str(uuid.uuid4())
    welcome_credits = 150
    
    new_user = User(
        id=user_id,
        email=user_data.email.lower().strip(),
        password_hash=hash_password(user_data.password),
        full_name=user_data.full_name.strip(),
        username=user_data.username.lower().strip(),
        avatar_url=f"https://api.dicebear.com/7.x/bottts/svg?seed={user_data.username}",
        onboarding_completed=False,
        eco_credits=welcome_credits,
        eco_score=75.0,
        current_streak=1,
        longest_streak=1,
        last_active_date=datetime.date.today()
    )
    db.add(new_user)

    # Welcome bonus transaction
    tx = CreditTransaction(
        id=str(uuid.uuid4()),
        user_id=user_id,
        amount=welcome_credits,
        transaction_type="welcome_bonus",
        description="EcoTrace Welcome EcoCredits Gift"
    )
    db.add(tx)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(data={"sub": new_user.id, "email": new_user.email})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "full_name": new_user.full_name,
            "username": new_user.username,
            "avatar_url": new_user.avatar_url,
            "onboarding_completed": new_user.onboarding_completed,
            "eco_credits": new_user.eco_credits,
            "eco_score": new_user.eco_score,
            "current_streak": new_user.current_streak
        }
    }


@router.post("/login", response_model=TokenResponse)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email.lower().strip()).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    # Update streak
    today = datetime.date.today()
    if user.last_active_date:
        diff_days = (today - user.last_active_date).days
        if diff_days == 1:
            user.current_streak += 1
            if user.current_streak > user.longest_streak:
                user.longest_streak = user.current_streak
        elif diff_days > 1:
            user.current_streak = 1
    user.last_active_date = today
    db.commit()
    db.refresh(user)

    access_token = create_access_token(data={"sub": user.id, "email": user.email})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "username": user.username,
            "avatar_url": user.avatar_url,
            "onboarding_completed": user.onboarding_completed,
            "eco_credits": user.eco_credits,
            "eco_score": user.eco_score,
            "current_streak": user.current_streak,
            "longest_streak": user.longest_streak
        }
    }


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    household_info = None
    if current_user.household:
        h = current_user.household
        household_info = {
            "home_type": h.home_type,
            "area_sqft": h.area_sqft,
            "city_state": h.city_state,
            "household_members": h.household_members,
            "avg_hours_at_home": h.avg_hours_at_home,
            "daily_co2_target_kg": h.daily_co2_target_kg,
            "appliances_count": len(h.appliances) if h.appliances else 0
        }

    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "username": current_user.username,
        "avatar_url": current_user.avatar_url,
        "onboarding_completed": current_user.onboarding_completed,
        "eco_credits": current_user.eco_credits,
        "eco_score": current_user.eco_score,
        "current_streak": current_user.current_streak,
        "longest_streak": current_user.longest_streak,
        "created_at": current_user.created_at,
        "household": household_info
    }


@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower().strip()).first()
    # Return simulated success regardless to prevent user enumeration
    return {
        "success": True,
        "message": f"If an account exists with {req.email}, a secure password reset link has been dispatched to your inbox (simulated demonstration mode)."
    }
