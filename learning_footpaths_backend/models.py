from uuid import uuid4

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, ForeignKey, Table, Text
from sqlalchemy.orm import relationship, sessionmaker
from database import Base, engine

db = SQLAlchemy()

# create a session factory
Session = sessionmaker(bind=engine)


def get_uuid():
    return uuid4().hex


# class User(db.Model):
#     __tablename__ = "users"  # for table name
#     id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
#     email = db.Column(db.String(345), unique=True, nullable=False)
#     password = db.Column(db.Text, nullable=False)


# Association table for many-to-many relationship between Footpaths and Exhibitions
footpath_exhibition = Table(
    "footpath_exhibition",
    Base.metadata,
    Column(
        "footpath_id", Integer, ForeignKey("learning_footpaths.id"), primary_key=True
    ),
    Column("exhibition_id", Integer, ForeignKey("exhibitions.id"), primary_key=True),
)


class User(Base):
    __tablename__ = "users"

    id = Column(String(32), primary_key=True, unique=True, default=get_uuid)
    email = Column(String(345), unique=True, nullable=False)
    password = Column(Text, nullable=False)


class LearningFootpath(Base):
    __tablename__ = "learning_footpaths"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    big_question = Column(String)

    # Many-to-many relationship with exhibitions
    exhibitions = relationship(
        "Exhibition", secondary=footpath_exhibition, back_populates="footpaths"
    )


class Exhibition(Base):
    __tablename__ = "exhibitions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    big_question = Column(String)

    # Many-to-many relationship with footpaths
    footpaths = relationship(
        "LearningFootpath", secondary=footpath_exhibition, back_populates="exhibitions"
    )


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    exhibition_id = Column(Integer, ForeignKey("exhibitions.id"))
    text = Column(String)
    option_a = Column(String)
    option_b = Column(String)
    option_c = Column(String)
    option_d = Column(String)
    correct_answer = Column(String)  # Store the correct option (e.g., "A")
