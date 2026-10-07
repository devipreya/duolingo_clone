from datetime import date, datetime, timedelta
from fastapi import Header
from sqlalchemy.orm import Session
from ..models import User, DailyXP

MAX_HEARTS, REGEN_MIN = 5, 5

def today(x_debug_date: str | None = Header(None)) -> date:
    """Simulate day changes for testing: send header X-Debug-Date: 2026-10-07"""
    return date.fromisoformat(x_debug_date) if x_debug_date else date.today()

def regen_hearts(user: User) -> None:
    if user.hearts >= MAX_HEARTS:
        user.hearts_updated_at = datetime.utcnow(); return
    gained = int((datetime.utcnow() - user.hearts_updated_at).total_seconds() // (REGEN_MIN * 60))
    if gained:
        user.hearts = min(MAX_HEARTS, user.hearts + gained)
        user.hearts_updated_at += timedelta(minutes=gained * REGEN_MIN)

def lose_heart(user: User) -> None:
    regen_hearts(user)
    if user.hearts == MAX_HEARTS:
        user.hearts_updated_at = datetime.utcnow()  # start regen timer
    user.hearts = max(0, user.hearts - 1)

def update_streak(user: User, d: date) -> None:
    if user.last_active_date == d: return
    user.streak = user.streak + 1 if user.last_active_date == d - timedelta(days=1) else 1
    user.last_active_date = d

def add_xp(db: Session, user: User, d: date, amount: int) -> None:
    user.xp += amount
    row = db.get(DailyXP, (user.id, d)) or DailyXP(user_id=user.id, date=d, xp=0)
    row.xp += amount
    db.add(row)

def xp_today(db: Session, user: User, d: date) -> int:
    row = db.get(DailyXP, (user.id, d))
    return row.xp if row else 0