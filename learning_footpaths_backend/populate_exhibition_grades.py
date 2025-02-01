import os

from config import ApplicationConfig
from database import SessionLocal  # Add this import
from dotenv import load_dotenv
from flask import Flask
from models import Exhibition, GradeLevel, db

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config.from_object(ApplicationConfig)
db.init_app(app)


def assign_exhibition_grades():
    with app.app_context():
        db_session = SessionLocal()  # Create a session
        try:
            exhibition_grades = {
                1: ["10"],
                2: ["7", "8", "9", "10"],
                3: ["4", "5", "6", "7", "8", "9", "10"],
                4: ["8", "9", "10"],
                5: ["4", "5", "7", "9", "10"],
                6: ["4", "8", "9", "10"],
                7: ["9", "10"],
                8: ["9", "10"],
                9: ["10"],
                10: ["10"],
                11: ["6", "10"],
                12: ["10"],
                13: ["9", "10"],
                14: ["10"],
                15: ["10"],
                16: ["10"],
                17: ["7", "10"],
                18: ["3", "10"],
                19: ["10"],
                20: ["10"],
                21: ["9", "10"],
                22: ["5", "6", "7", "8", "9", "10"],
                23: ["9", "10"],
                24: ["9", "10"],
                25: ["10"],
            }

            for exhibition_id, grades in exhibition_grades.items():
                exhibition = db_session.get(Exhibition, exhibition_id)
                if exhibition:
                    grade_levels = (
                        db_session.query(GradeLevel)
                        .filter(GradeLevel.grade.in_(grades))
                        .all()
                    )
                    exhibition.grade_levels = grade_levels
                    print(f"Assigned grades {grades} to exhibition {exhibition.title}")

            db_session.commit()
        except Exception as e:
            db_session.rollback()
            print(f"Error: {e}")
            import traceback

            print(traceback.format_exc())
        finally:
            db_session.close()


if __name__ == "__main__":
    assign_exhibition_grades()
