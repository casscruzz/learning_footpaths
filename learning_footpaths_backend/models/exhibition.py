from sqlalchemy import Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship
from database import Base, db

# Association table for exhibitions and grade levels
exhibition_grade_levels = Table(
    "exhibition_grade_levels",
    Base.metadata,
    Column("exhibition_id", Integer, ForeignKey("exhibitions.id"), primary_key=True),
    Column(
        "grade_level", String(2), ForeignKey("grade_levels.grade"), primary_key=True
    ),
)


class Exhibition(Base):
    __tablename__ = "exhibitions"
    id = Column(Integer, primary_key=True)
    title = Column(String)
    big_question = Column(String)

    # Relationships
    grade_levels = relationship(
        "GradeLevel",
        secondary=exhibition_grade_levels,
        back_populates="exhibitions",
    )
    footpaths = relationship(
        "LearningFootpath",
        secondary="footpath_exhibition",
        back_populates="exhibitions",
    )
    # Use strings for relationship targets to avoid circular imports
    questions = relationship("Question", back_populates="exhibition", lazy="dynamic")
    user_progress = relationship(
        "UserExhibitionProgress", back_populates="exhibition", lazy="dynamic"
    )


class GradeLevel(Base):
    __tablename__ = "grade_levels"
    grade = Column(String(2), primary_key=True)
    description = Column(String(50))

    exhibitions = relationship(
        "Exhibition", secondary=exhibition_grade_levels, back_populates="grade_levels"
    )


# Import these at the bottom to avoid circular imports
from .progress import Question, UserExhibitionProgress
