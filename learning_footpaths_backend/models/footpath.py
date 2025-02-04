from sqlalchemy import Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship
from database import Base, db

# Association table for many-to-many relationship
footpath_exhibition = Table(
    "footpath_exhibition",
    Base.metadata,
    Column(
        "footpath_id", Integer, ForeignKey("learning_footpaths.id"), primary_key=True
    ),
    Column("exhibition_id", Integer, ForeignKey("exhibitions.id"), primary_key=True),
)


class LearningFootpath(Base):
    __tablename__ = "learning_footpaths"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)
    big_question = Column(String)

    exhibitions = relationship(
        "Exhibition", secondary=footpath_exhibition, back_populates="footpaths"
    )
