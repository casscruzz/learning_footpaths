from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from database import Base


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
