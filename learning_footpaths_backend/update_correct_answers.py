## made a mistake and added new questions with the wrong correct answer. fixing it here
# update_correct_answers.py
from config import ApplicationConfig
from flask import Flask
from database import SessionLocal
from models import Question, db

app = Flask(__name__)
app.config.from_object(ApplicationConfig)
db.init_app(app)


def update_correct_answers():
    with app.app_context():
        db_session = SessionLocal()
        try:
            # Update existing questions
            questions = db_session.query(Question).all()
            for question in questions:
                # Convert 'A' to 'Option 1', 'B' to 'Option 2', etc.
                if question.correct_answer == "A":
                    question.correct_answer = "Option 1"
                elif question.correct_answer == "B":
                    question.correct_answer = "Option 2"
                elif question.correct_answer == "C":
                    question.correct_answer = "Option 3"
                elif question.correct_answer == "D":
                    question.correct_answer = "Option 4"

            db_session.commit()
            print("Successfully updated correct answers format")

        except Exception as e:
            db_session.rollback()
            print(f"Error: {e}")
        finally:
            db_session.close()


if __name__ == "__main__":
    update_correct_answers()
