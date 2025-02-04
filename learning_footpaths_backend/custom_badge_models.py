# from datetime import datetime
# from sqlalchemy import (
#     Boolean,
#     Column,
#     DateTime,
#     ForeignKey,
#     Integer,
#     String,
#     Table,
#     Text,
# )
# from sqlalchemy.orm import relationship
# from database import Base
# from models import User, Exhibition, GradeLevel

# # Association table for custom badges and their exhibitions
# custom_badge_exhibitions = Table(
#     "custom_badge_exhibitions",
#     Base.metadata,
#     Column(
#         "custom_badge_id", Integer, ForeignKey("custom_badges.id"), primary_key=True
#     ),
#     Column("exhibition_id", Integer, ForeignKey("exhibitions.id"), primary_key=True),
# )

# # Association table for users and the custom badges they've discovered/added
# user_custom_badges = Table(
#     "user_custom_badges",
#     Base.metadata,
#     Column("user_id", String(32), ForeignKey("users.id"), primary_key=True),
#     Column(
#         "custom_badge_id", Integer, ForeignKey("custom_badges.id"), primary_key=True
#     ),
#     Column("added_at", DateTime, default=datetime.utcnow),
# )


# class CustomBadge(Base):
#     __tablename__ = "custom_badges"
#     id = Column(Integer, primary_key=True)
#     name = Column(String(255), nullable=False)
#     description = Column(Text, nullable=False)
#     badge_image_url = Column(String(255), nullable=False)
#     creator_id = Column(String(32), ForeignKey("users.id"), nullable=False)
#     grade_level = Column(String(2), ForeignKey("grade_levels.grade"), nullable=False)
#     created_at = Column(DateTime, default=datetime.utcnow)
#     is_public = Column(Boolean, default=True)  # Controls visibility in explorer

#     # Relationships
#     creator = relationship("User", backref="created_badges")
#     grade = relationship("GradeLevel")
#     exhibitions = relationship(
#         "Exhibition", secondary=custom_badge_exhibitions, backref="custom_badges"
#     )
#     users = relationship(
#         "User", secondary=user_custom_badges, backref="discovered_badges"
#     )
