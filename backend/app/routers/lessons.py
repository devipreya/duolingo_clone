import re
from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import *
from ..services import gamification as g

router = APIRouter(prefix="/api")
DEFAULT_USER = 1  # simplified auth: default logged-in learner

norm = lambda s: re.sub(r"[^\w\s]", "", s.lower()).strip()

@router.get("/lessons/{lesson_id}")
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.get(Lesson, lesson_id) or _404()
    user = db.get(User, DEFAULT_USER); g.regen_hearts(user); db.commit()
    return {
        "id": lesson.id, "hearts": user.hearts,
        "exercises": [{  # answers are NOT sent (except match pairs, checked client-side)
            "id": e.id, "type": e.type, "prompt": e.prompt, "data": e.data,
        } for e in lesson.exercises],
    }

class CheckIn(BaseModel):
    answer: str

@router.post("/exercises/{ex_id}/check")
def check(ex_id: int, body: CheckIn, db: Session = Depends(get_db)):
    ex = db.get(Exercise, ex_id) or _404()
    user = db.get(User, DEFAULT_USER)
    correct = norm(body.answer) in [norm(a) for a in ex.answer]
    if not correct:
        g.lose_heart(user)
    db.commit()
    return {"correct": correct, "correct_answer": ex.answer[0], "hearts": user.hearts}

class CompleteIn(BaseModel):
    mistakes: int = 0

@router.post("/lessons/{lesson_id}/complete")
def complete(lesson_id: int, body: CompleteIn, db: Session = Depends(get_db), d: date = Depends(g.today)):
    lesson = db.get(Lesson, lesson_id) or _404()
    user = db.get(User, DEFAULT_USER)
    xp = 10 + (5 if body.mistakes == 0 else 0)          # +5 bonus for perfect lesson
    g.add_xp(db, user, d, xp)
    g.update_streak(user, d)

    prog = db.get(UserSkillProgress, (user.id, lesson.skill_id)) \
        or UserSkillProgress(user_id=user.id, skill_id=lesson.skill_id, level_completed=0)
    prog.level_completed = max(prog.level_completed, lesson.level)
    db.add_all([prog, LessonAttempt(user_id=user.id, lesson_id=lesson.id, xp_earned=xp, mistakes=body.mistakes)])
    db.commit()
    return {"xp": xp, "streak": user.streak, "total_xp": user.xp,
            "daily_xp": g.xp_today(db, user, d), "daily_goal": user.daily_goal}

@router.post("/me/refill")  # mocked "practice / refill" using gems
def refill(db: Session = Depends(get_db)):
    user = db.get(User, DEFAULT_USER)
    if user.gems < 350: raise HTTPException(400, "Not enough gems")
    user.gems -= 350; user.hearts = g.MAX_HEARTS; db.commit()
    return {"hearts": user.hearts, "gems": user.gems}

def _404(): raise HTTPException(404, "Not found")