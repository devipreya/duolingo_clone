from datetime import date, timedelta
from .models import *

def run(db):
    if db.query(Course).first(): return
    c = Course(language="Spanish", title="Spanish for English speakers"); db.add(c); db.flush()
    u = Unit(course_id=c.id, order=1, title="Unit 1: Greetings", description="Say hello", color="#58cc02")
    db.add(u); db.flush()
    s = Skill(unit_id=u.id, order=1, title="Basics", icon="🥚", levels=2); db.add(s); db.flush()
    l = Lesson(skill_id=s.id, level=1); db.add(l); db.flush()
    db.add_all([
        Exercise(lesson_id=l.id, order=1, type="multiple_choice", prompt="Which of these is “apple”?",
                 data={"choices": ["la manzana", "el pan", "la leche"]}, answer=["la manzana"]),
        Exercise(lesson_id=l.id, order=2, type="translate_bank", prompt="Translate: The boy drinks milk",
                 data={"words": ["El", "niño", "bebe", "leche", "pan", "agua"]}, answer=["El niño bebe leche"]),
        Exercise(lesson_id=l.id, order=3, type="match_pairs", prompt="Tap the matching pairs",
                 data={"pairs": [["water", "agua"], ["bread", "pan"], ["milk", "leche"], ["boy", "niño"]]}, answer=["ok"]),
        Exercise(lesson_id=l.id, order=4, type="fill_blank", prompt="Yo ___ pan.",
                 data={"choices": ["como", "comes", "come"]}, answer=["como"]),
        Exercise(lesson_id=l.id, order=5, type="type_answer", prompt="Type in Spanish: the water",
                 data={}, answer=["el agua"]),
    ])
    db.add(Lesson(skill_id=s.id, level=2))  # + exercises
    me = User(name="Learner", xp=120, streak=3, last_active_date=date.today() - timedelta(days=1))
    db.add(me)
    for i, (n, xp) in enumerate([("Maria", 840), ("Chen", 610), ("Aarav", 455), ("Lena", 300)], 2):
        db.add(User(id=i, name=n, xp=xp))
    db.commit()