# populate_questions.py
from models import db, Exhibition, Question, exhibition_grade_levels
from flask import Flask
from config import ApplicationConfig
from database import SessionLocal

app = Flask(__name__)
app.config.from_object(ApplicationConfig)
db.init_app(app)


def create_placeholder_questions():
    with app.app_context():
        db_session = SessionLocal()
        try:
            # Get all exhibitions
            exhibitions = db_session.query(Exhibition).all()

            for exhibition in exhibitions:
                # Get all grade levels for this exhibition
                grade_levels = [grade.grade for grade in exhibition.grade_levels]

                for grade in grade_levels:
                    # Skip grade 10 as it already has questions
                    if grade == "10":
                        continue

                    # Create 5 placeholder questions for each grade level
                    for q_num in range(1, 6):
                        question = Question(
                            exhibition_id=exhibition.id,
                            grade_level=grade,
                            text=f"Grade {grade} - {exhibition.title} - Question {q_num}",
                            option_a=f"Grade {grade} - Option A",
                            option_b=f"Grade {grade} - Option B",
                            option_c=f"Grade {grade} - Option C",
                            option_d=f"Grade {grade} - Option D",
                            correct_answer="A",  # Default correct answer
                        )
                        db_session.add(question)
                print(f"Added placeholder questions for Exhibition {exhibition.title}")

            db_session.commit()
            print("Successfully created placeholder questions for all grades except 10")

        except Exception as e:
            db_session.rollback()
            print(f"Error: {e}")
        finally:
            db_session.close()


if __name__ == "__main__":
    create_placeholder_questions()
