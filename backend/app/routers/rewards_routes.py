import uuid
import random
import string
import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Reward, Redemption, CreditTransaction
from ..schemas import RedeemRequest
from ..auth import get_current_user

router = APIRouter(prefix="/rewards", tags=["Rewards & Marketplace"])

def generate_voucher_code(prefix: str) -> str:
    rand_chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"{prefix}-{rand_chars}"

@router.get("/")
def get_rewards(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rewards = db.query(Reward).filter(Reward.is_active == True).all()
    user_redemptions = db.query(Redemption).filter(
        Redemption.user_id == current_user.id
    ).order_by(Redemption.redeemed_at.desc()).all()

    redemption_history = []
    for red in user_redemptions:
        redemption_history.append({
            "id": red.id,
            "reward_id": red.reward_id,
            "reward_title": red.reward.title if red.reward else "Eco Reward",
            "merchant": red.reward.merchant if red.reward else "EcoTrace",
            "discount_text": red.reward.discount_text if red.reward else "Special Discount",
            "voucher_code": red.voucher_code,
            "credits_spent": red.credits_spent,
            "redeemed_at": red.redeemed_at.isoformat(),
            "is_revealed": red.is_revealed,
            "revealed_at": red.revealed_at.isoformat() if red.revealed_at else None
        })

    return {
        "user_balance": current_user.eco_credits,
        "rewards": [
            {
                "id": r.id,
                "title": r.title,
                "merchant": r.merchant,
                "category": r.category,
                "discount_text": r.discount_text,
                "required_credits": r.required_credits,
                "badge_color": r.badge_color,
                "icon_name": r.icon_name,
                "terms": r.terms,
                "can_afford": current_user.eco_credits >= r.required_credits
            }
            for r in rewards
        ],
        "redemptions": redemption_history
    }


@router.post("/redeem")
def redeem_reward(
    payload: RedeemRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    reward = db.query(Reward).filter(Reward.id == payload.reward_id, Reward.is_active == True).first()
    if not reward:
        raise HTTPException(status_code=404, detail="Reward not found or currently inactive.")

    if current_user.eco_credits < reward.required_credits:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient EcoCredits. You have {current_user.eco_credits} credits, but {reward.required_credits} are required."
        )

    # Deduct credits
    current_user.eco_credits -= reward.required_credits

    # Generate unique demonstration coupon
    voucher = generate_voucher_code(reward.sample_code_prefix)
    redemption_id = str(uuid.uuid4())

    redemption = Redemption(
        id=redemption_id,
        user_id=current_user.id,
        reward_id=reward.id,
        credits_spent=reward.required_credits,
        voucher_code=voucher,
        redeemed_at=datetime.datetime.utcnow(),
        is_revealed=False  # Requires scratch card reveal!
    )
    db.add(redemption)

    # Log credit transaction
    tx = CreditTransaction(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        amount=-reward.required_credits,
        transaction_type="reward_redeemed",
        description=f"Redeemed: {reward.title} ({reward.merchant})"
    )
    db.add(tx)

    # If it's a mystery box, also add randomized bonus credits on reveal
    db.commit()

    return {
        "success": True,
        "message": f"Successfully unlocked {reward.title}! Scratch to reveal your voucher code.",
        "redemption_id": redemption_id,
        "voucher_code": voucher,
        "credits_spent": reward.required_credits,
        "new_balance": current_user.eco_credits
    }


@router.post("/reveal/{redemption_id}")
def reveal_scratch_card(
    redemption_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    redemption = db.query(Redemption).filter(
        Redemption.id == redemption_id,
        Redemption.user_id == current_user.id
    ).first()
    if not redemption:
        raise HTTPException(status_code=404, detail="Redemption record not found.")

    if not redemption.is_revealed:
        redemption.is_revealed = True
        redemption.revealed_at = datetime.datetime.utcnow()
        
        # Check if mystery bonus pack
        bonus_credits = 0
        if redemption.reward and redemption.reward.category == "Bonus":
            bonus_credits = random.choice([50, 100, 150, 200, 300])
            current_user.eco_credits += bonus_credits
            tx = CreditTransaction(
                id=str(uuid.uuid4()),
                user_id=current_user.id,
                amount=bonus_credits,
                transaction_type="mystery_bonus",
                description="Mystery Box EcoCredits Bonus Won!"
            )
            db.add(tx)

        db.commit()

    return {
        "success": True,
        "voucher_code": redemption.voucher_code,
        "reward_title": redemption.reward.title if redemption.reward else "Reward",
        "merchant": redemption.reward.merchant if redemption.reward else "Merchant",
        "discount_text": redemption.reward.discount_text if redemption.reward else "Voucher",
        "new_balance": current_user.eco_credits
    }


@router.get("/transactions")
def get_credit_transactions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    txs = db.query(CreditTransaction).filter(
        CreditTransaction.user_id == current_user.id
    ).order_by(CreditTransaction.created_at.desc()).limit(50).all()

    return {
        "balance": current_user.eco_credits,
        "transactions": [
            {
                "id": t.id,
                "amount": t.amount,
                "type": t.transaction_type,
                "description": t.description,
                "created_at": t.created_at.strftime("%b %d, %Y %I:%M %p")
            }
            for t in txs
        ]
    }
