from sqlalchemy.orm import Session
from models import User, LearningFootpath, Exhibition, Question

### DO I STILL NEED THIS FILE?


# Create a new user
def create_user(db: Session, username: str, email: str, password_hash: str):
    user = User(username=username, email=email, password_hash=password_hash)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# Get all learning footpaths
def get_footpaths(db: Session):
    return db.query(LearningFootpath).all()


# Add an exhibition to a footpath
def add_exhibition_to_footpath(db: Session, footpath_id: int, exhibition_id: int):
    footpath = (
        db.query(LearningFootpath).filter(LearningFootpath.id == footpath_id).first()
    )
    exhibition = db.query(Exhibition).filter(Exhibition.id == exhibition_id).first()
    if footpath and exhibition:
        footpath.exhibitions.append(exhibition)
        db.commit()
