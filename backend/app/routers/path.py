from datetime import date

from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy import select, func

from sqlalchemy.orm import Session

from ..database import get_db

from ..models import *

from ..services import gamification as g


router = APIRouter(prefix="/api")


@router.get("/me")
def me(db: Session = Depends(get_db), d: date = Depends(g.today)):

    u = db.get(User, 1)

    if not u:
        raise HTTPException(status_code=404, detail="User not found")

    g.regen_hearts(u)
    db.commit()

    return {
        "name": u.name,
        "xp": u.xp,
        "streak": u.streak,
        "hearts": u.hearts,
        "gems": u.gems,
        "daily_xp": g.xp_today(db, u, d),
        "daily_goal": u.daily_goal
    }


@router.post("/me/lose-heart")
def lose_heart(db: Session = Depends(get_db)):

    u = db.get(User, 1)

    if not u:
        raise HTTPException(status_code=404, detail="User not found")

    g.lose_heart(u)

    db.commit()

    return {"hearts": u.hearts}


@router.post("/me/refill")
def refill_hearts(db: Session = Depends(get_db)):

    u = db.get(User, 1)

    if not u:
        raise HTTPException(status_code=404, detail="User not found")

    u.hearts = 5

    db.commit()

    return {"hearts": u.hearts}


@router.post("/me/practice")
def practice_for_heart(db: Session = Depends(get_db)):

    u = db.get(User, 1)

    if not u:
        raise HTTPException(status_code=404, detail="User not found")

    if u.hearts < 5:
        u.hearts += 1

    db.commit()

    return {"hearts": u.hearts}


@router.get("/path")
def path(db: Session = Depends(get_db)):

    done = {
        p.skill_id: p.level_completed
        for p in db.scalars(
            select(UserSkillProgress).where(
                UserSkillProgress.user_id == 1
            )
        )
    }

    out, prev_done = [], True

    for unit in db.scalars(select(Unit).order_by(Unit.order)):

        skills = []

        for s in unit.skills:

            lvl = done.get(s.id, 0)

            state = (
                "completed"
                if lvl >= s.levels
                else ("available" if prev_done else "locked")
            )

            nxt = next(
                (l.id for l in s.lessons if l.level > lvl),
                s.lessons[-1].id
            )

            skills.append({
                "id": s.id,
                "title": s.title,
                "icon": s.icon,
                "levels": s.levels,
                "level_completed": lvl,
                "state": state,
                "next_lesson_id": nxt
            })

            prev_done = lvl >= 1

        out.append({
            "id": unit.id,
            "title": unit.title,
            "description": unit.description,
            "color": unit.color,
            "skills": skills
        })

    return out


@router.get("/leaderboard")
def leaderboard(db: Session = Depends(get_db)):

    rows = db.execute(
        select(User.id, User.name, User.xp)
        .order_by(User.xp.desc())
        .limit(30)
    ).all()

    return [
        {
            "rank": i + 1,
            "id": r.id,
            "name": r.name,
            "xp": r.xp
        }
        for i, r in enumerate(rows)
    ]