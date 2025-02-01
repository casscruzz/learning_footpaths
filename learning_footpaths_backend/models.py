from datetime import datetime
from uuid import uuid4

from database import Base, engine
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Table,
    Text,
)
from sqlalchemy.orm import relationship, sessionmaker

db = SQLAlchemy()

# # create a session factory
# Session = sessionmaker(bind=engine)


def get_uuid():
    return uuid4().hex


# Association table for many-to-many relationship
footpath_exhibition = Table(
    "footpath_exhibition",
    Base.metadata,
    Column(
        "footpath_id", Integer, ForeignKey("learning_footpaths.id"), primary_key=True
    ),
    Column("exhibition_id", Integer, ForeignKey("exhibitions.id"), primary_key=True),
)

# # Association table for exhibitions and grade levels
# exhibition_grade_levels = Table(
#     "exhibition_grade_levels",
#     Base.metadata,
#     Column("exhibition_id", Integer, ForeignKey("exhibitions.id"), primary_key=True),
#     Column("grade_level", String(2), primary_key=True),  # 'K' or '1' through '12'
# )
exhibition_grade_levels = Table(
    "exhibition_grade_levels",
    Base.metadata,
    Column("exhibition_id", Integer, ForeignKey("exhibitions.id"), primary_key=True),
    Column(
        "grade_level", String(2), ForeignKey("grade_levels.grade"), primary_key=True
    ),
)


class User(Base):
    __tablename__ = "users"
    id = Column(String(32), primary_key=True, unique=True, default=get_uuid)
    email = Column(String(345), unique=True, nullable=False)
    password = Column(Text, nullable=False)
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    grade_level = Column(String(2), nullable=True)  # 'K' or '1' through '12'
    profile_photo = Column(String(255), nullable=True)
    exhibition_progress = relationship("UserExhibitionProgress", back_populates="user")


class LearningFootpath(Base):
    __tablename__ = "learning_footpaths"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)
    big_question = Column(String)
    exhibitions = relationship(
        "Exhibition", secondary=footpath_exhibition, back_populates="footpaths"
    )


class Exhibition(Base):
    __tablename__ = "exhibitions"
    id = Column(Integer, primary_key=True)
    title = Column(String)
    big_question = Column(String)

    # Define the relationship with grade levels
    # grade_levels = relationship(
    #     "GradeLevel", secondary=exhibition_grade_levels, backref="exhibitions"
    # )
    grade_levels = relationship(
        "GradeLevel",
        secondary=exhibition_grade_levels,
        back_populates="exhibitions",  # Changed from backref to back_populates
    )

    footpaths = relationship(
        "LearningFootpath", secondary=footpath_exhibition, back_populates="exhibitions"
    )
    questions = relationship("Question", back_populates="exhibition")
    user_progress = relationship("UserExhibitionProgress", back_populates="exhibition")


class GradeLevel(Base):
    __tablename__ = "grade_levels"
    grade = Column(String(2), primary_key=True)  # 'K' or '1' through '12'
    description = Column(String(50))  # e.g., "Kindergarten" or "Grade 1"

    # Add this relationship
    exhibitions = relationship(
        "Exhibition", secondary=exhibition_grade_levels, back_populates="grade_levels"
    )


class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True)
    exhibition_id = Column(Integer, ForeignKey("exhibitions.id"))
    grade_level = Column(String(2), ForeignKey("grade_levels.grade"), nullable=False)
    text = Column(String)
    option_a = Column(String)
    option_b = Column(String)
    option_c = Column(String)
    option_d = Column(String)
    correct_answer = Column(String)

    exhibition = relationship("Exhibition", back_populates="questions")
    grade = relationship("GradeLevel")


# model for user exhibition progress
class UserExhibitionProgress(Base):
    __tablename__ = "user_exhibition_progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(32), ForeignKey("users.id"), nullable=False)
    exhibition_id = Column(Integer, ForeignKey("exhibitions.id"), nullable=False)
    score = Column(Integer, nullable=False, default=0)
    completed = Column(Boolean, nullable=False, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    footpath_id = Column(Integer, nullable=True)

    user = relationship("User", back_populates="exhibition_progress")
    exhibition = relationship("Exhibition")


# table to store temporary scores
# Add this new model to models.py
class TempQuizResult(Base):
    __tablename__ = "temp_quiz_results"
    id = Column(Integer, primary_key=True)
    session_id = Column(String(32), unique=True, nullable=False)
    exhibition_id = Column(Integer, ForeignKey("exhibitions.id"))
    score = Column(Integer, default=0)
    footpath_name = Column(String)  # Add this line
    footpath_id = Column(Integer, ForeignKey("learning_footpaths.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
