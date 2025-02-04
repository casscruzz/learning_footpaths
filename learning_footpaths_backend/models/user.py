from uuid import uuid4
from sqlalchemy import Column, String, Text
from sqlalchemy.orm import relationship
from database import Base, db


def get_uuid():
    return uuid4().hex


class User(Base):
    __tablename__ = "users"
    id = Column(String(32), primary_key=True, unique=True, default=get_uuid)
    email = Column(String(345), unique=True, nullable=False)
    password = Column(Text, nullable=False)
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    grade_level = Column(String(2), nullable=True)  # 'K' or '1' through '12'
    profile_photo = Column(String(255), nullable=True)

    # Relationships will be set up after other models are imported
    exhibition_progress = relationship("UserExhibitionProgress", back_populates="user")
    # custom_badges relationship will be set up in custom_badge.py
