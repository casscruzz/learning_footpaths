from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from database import Base
from models.question import Question


class UserExhibitionProgress(Base):
    __tablename__ = "user_exhibition_progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(32), ForeignKey("users.id"), nullable=False)
    exhibition_id = Column(Integer, ForeignKey("exhibitions.id"), nullable=False)
    score = Column(Integer, nullable=False, default=0)
    completed = Column(Boolean, nullable=False, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    footpath_id = Column(Integer, nullable=True)
    custom_badge_id = Column(
        Integer, ForeignKey("custom_badges.id"), nullable=True
    )  # Add this line

    user = relationship("User", back_populates="exhibition_progress")
    exhibition = relationship("Exhibition", back_populates="user_progress")
    custom_badge = relationship(
        "CustomBadge", backref="exhibition_progress"
    )  # Add this line


class TempQuizResult(Base):
    __tablename__ = "temp_quiz_results"
    id = Column(Integer, primary_key=True)
    session_id = Column(String(32), unique=True, nullable=False)
    exhibition_id = Column(Integer, ForeignKey("exhibitions.id"))
    score = Column(Integer, default=0)
    footpath_name = Column(String)
    footpath_id = Column(Integer, ForeignKey("learning_footpaths.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
