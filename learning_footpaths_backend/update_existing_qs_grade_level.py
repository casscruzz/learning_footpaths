from models import db, Question
from flask import Flask
from config import ApplicationConfig
from database import SessionLocal

app = Flask(__name__)
app.config.from_object(ApplicationConfig)
db.init_app(app)


def update_existing_questions():
    with app.app_context():
        db_session = SessionLocal()
        try:
            # Update all existing questions to grade 10
            db_session.query(Question).update({Question.grade_level: "10"})
            db_session.commit()
            print("Successfully updated all existing questions to grade 10")

        except Exception as e:
            db_session.rollback()
            print(f"Error: {e}")
        finally:
            db_session.close()


if __name__ == "__main__":
    update_existing_questions()
