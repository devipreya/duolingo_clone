from datetime import date as date_type, datetime

from sqlalchemy import ForeignKey, JSON, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50))
    xp: Mapped[int] = mapped_column(default=0)
    streak: Mapped[int] = mapped_column(default=0)
    last_active_date: Mapped[date_type | None]
    hearts: Mapped[int] = mapped_column(default=5)
    hearts_updated_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    gems: Mapped[int] = mapped_column(default=500)
    daily_goal: Mapped[int] = mapped_column(default=20)


class Course(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(primary_key=True)
    language: Mapped[str]
    title: Mapped[str]
    units: Mapped[list["Unit"]] = relationship(order_by="Unit.order")


class Unit(Base):
    __tablename__ = "units"

    id: Mapped[int] = mapped_column(primary_key=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"))
    order: Mapped[int]
    title: Mapped[str]
    description: Mapped[str]
    color: Mapped[str] = mapped_column(default="#58cc02")
    skills: Mapped[list["Skill"]] = relationship(order_by="Skill.order")


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(primary_key=True)
    unit_id: Mapped[int] = mapped_column(ForeignKey("units.id"))
    order: Mapped[int]
    title: Mapped[str]
    icon: Mapped[str] = mapped_column(default="⭐")
    levels: Mapped[int] = mapped_column(default=3)
    lessons: Mapped[list["Lesson"]] = relationship(order_by="Lesson.level")


class Lesson(Base):
    __tablename__ = "lessons"

    id: Mapped[int] = mapped_column(primary_key=True)
    skill_id: Mapped[int] = mapped_column(ForeignKey("skills.id"))
    level: Mapped[int] = mapped_column(default=1)
    exercises: Mapped[list["Exercise"]] = relationship(order_by="Exercise.order")


class Exercise(Base):
    __tablename__ = "exercises"

    id: Mapped[int] = mapped_column(primary_key=True)
    lesson_id: Mapped[int] = mapped_column(ForeignKey("lessons.id"))
    order: Mapped[int]
    type: Mapped[str]
    prompt: Mapped[str]
    data: Mapped[dict] = mapped_column(JSON, default=dict)
    answer: Mapped[list] = mapped_column(JSON, default=list)


class UserSkillProgress(Base):
    __tablename__ = "user_skill_progress"

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        primary_key=True
    )
    skill_id: Mapped[int] = mapped_column(
        ForeignKey("skills.id"),
        primary_key=True
    )
    level_completed: Mapped[int] = mapped_column(default=0)


class LessonAttempt(Base):
    __tablename__ = "lesson_attempts"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    lesson_id: Mapped[int] = mapped_column(ForeignKey("lessons.id"))
    xp_earned: Mapped[int]
    mistakes: Mapped[int]
    completed_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)


class DailyXP(Base):
    __tablename__ = "daily_xp"

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        primary_key=True
    )
    date: Mapped[date_type] = mapped_column(primary_key=True)
    xp: Mapped[int] = mapped_column(default=0)