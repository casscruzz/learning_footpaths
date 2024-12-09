# from flask import Flask, jsonify, request, session
# from flask_sqlalchemy import SQLAlchemy
# from flask_migrate import Migrate
# from flask_cors import CORS
# from flask_bcrypt import Bcrypt
# from flask_session import Session
# from config import ApplicationConfig
# from database import Base, engine, db  # Import the db instance from database.py
# from models import Session, User  # Import your models here
# from redis import Redis
from flask import Flask, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_session import Session as FlaskSession
from config import ApplicationConfig
from database import db, SessionLocal  # Base, engine, ,
from models import (
    User,
    LearningFootpath,
    Exhibition,
    Question,
    UserExhibitionProgress,
    footpath_exhibition,
)
from redis import Redis
from datetime import datetime, timedelta
from models import TempQuizResult
import os

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

app.secret_key = os.getenv("SECRET_KEY")

db.init_app(app)
migrate = Migrate(app, db)

cors = CORS(
    app,
    resources={r"/*": {"origins": "http://localhost:5173"}},
    supports_credentials=True,
)

bcrypt = Bcrypt(app)
server_session = FlaskSession(app)


# get current user route
@app.route("/@me", methods=["GET"])
def get_current_user():
    user_id = session.get("user_id")

    # if no user id
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    db_session = SessionLocal()
    try:
        user = db_session.query(User).get(user_id)
        return jsonify({"id": user.id, "email": user.email})
    finally:
        db_session.close()
    return jsonify({"id": user.id, "email": user.email})


# @app.route("/register", methods=["POST"])
# def register_user():
#     email = request.json["email"]
#     password = request.json["password"]
#     session_id = request.json.get("quiz_session_id")

#     if not email or not password:
#         return jsonify({"error": "Email and password are required."}), 400

#     temp_result = None

#     db_session = SessionLocal()
#     try:
#         user_exists = db_session.query(User).filter_by(email=email).first() is not None

#         if user_exists:
#             return jsonify({"error": "User already exists"}), 409

#         # Create new user
#         hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
#         new_user = User(email=email, password=hashed_password)
#         db_session.add(new_user)
#         db_session.commit()

#         # If there's a temporary quiz result, save it
#         if session_id:
#             temp_result = (
#                 db_session.query(TempQuizResult)
#                 .filter_by(session_id=session_id)
#                 .first()
#             )
#             if temp_result:
#                 new_progress = UserExhibitionProgress(
#                     user_id=new_user.id,
#                     exhibition_id=temp_result.exhibition_id,
#                     score=temp_result.score,
#                     completed=True,
#                 )
#                 db_session.add(new_progress)
#                 db_session.commit()

#                 # Clean up temporary result
#                 db_session.delete(temp_result)
#                 db_session.commit()

#         session["user_id"] = new_user.id
#         return jsonify(
#             {
#                 "id": new_user.id,
#                 "email": email,
#                 "footpath_name": temp_result.footpath_name if temp_result else None,
#             }
#         )
#     finally:
#         db_session.close()


# Modified register route
@app.route("/register", methods=["POST"])
def register_user():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")
    session_id = data.get("quiz_session_id")

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    db_session = SessionLocal()
    temp_result = None  # Initialize temp_result

    try:
        user_exists = db_session.query(User).filter_by(email=email).first() is not None

        if user_exists:
            return jsonify({"error": "User already exists"}), 409

        # Create new user
        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
        new_user = User(email=email, password=hashed_password)
        db_session.add(new_user)
        db_session.commit()

        # If there's a temporary quiz result, save it
        if session_id:
            temp_result = (
                db_session.query(TempQuizResult)
                .filter_by(session_id=session_id)
                .first()
            )
            if temp_result:
                new_progress = UserExhibitionProgress(
                    user_id=new_user.id,
                    exhibition_id=temp_result.exhibition_id,
                    score=temp_result.score,
                    completed=True,
                    timestamp=datetime.utcnow(),  # Ensure timestamp is set
                    footpath_id=temp_result.footpath_id,  # Add this line
                )
                db_session.add(new_progress)
                db_session.commit()

                # Clean up temporary result
                db_session.delete(temp_result)
                db_session.commit()

        session["user_id"] = new_user.id
        return (
            jsonify(
                {
                    "id": new_user.id,
                    "email": email,
                    "footpath_id": temp_result.footpath_id if temp_result else None,
                }
            ),
            201,
        )
    except Exception as e:
        db_session.rollback()
        app.logger.error(f"Error registering user: {e}")
        return jsonify({"error": "Internal server error."}), 500
    finally:
        db_session.close()


# Modified login route
# @app.route("/login", methods=["POST"])
# def login_user():
#     email = request.json["email"]
#     password = request.json["password"]
#     session_id = request.json.get("quiz_session_id")

#     db_session = SessionLocal()
#     temp_result = None
#     try:
#         user = db_session.query(User).filter_by(email=email).first()

#         if user is None or not bcrypt.check_password_hash(user.password, password):
#             return jsonify({"error": "Unauthorized"}), 401

#         # If there's a temporary quiz result, save it
#         if session_id:
#             temp_result = (
#                 db_session.query(TempQuizResult)
#                 .filter_by(session_id=session_id)
#                 .first()
#             )
#             if temp_result:
#                 existing_progress = (
#                     db_session.query(UserExhibitionProgress)
#                     .filter_by(user_id=user.id, exhibition_id=temp_result.exhibition_id)
#                     .first()
#                 )

#                 if existing_progress:
#                     existing_progress.score = max(
#                         existing_progress.score, temp_result.score
#                     )
#                     existing_progress.completed = True
#                 else:
#                     new_progress = UserExhibitionProgress(
#                         user_id=user.id,
#                         exhibition_id=temp_result.exhibition_id,
#                         score=temp_result.score,
#                         completed=True,
#                     )
#                     db_session.add(new_progress)

#                 db_session.commit()

#                 # Clean up temporary result
#                 db_session.delete(temp_result)
#                 db_session.commit()

#         session["user_id"] = user.id
#         return jsonify(
#             {
#                 "id": user.id,
#                 "email": user.email,
#                 "footpath_name": temp_result.footpath_name if temp_result else None,
#             }
#         )
#     finally:
#         db_session.close()


@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]
    session_id = request.json.get("quiz_session_id")

    db_session = SessionLocal()
    try:
        user = db_session.query(User).filter_by(email=email).first()

        if user is None or not bcrypt.check_password_hash(user.password, password):
            return jsonify({"error": "Unauthorized"}), 401

        # If there's a temporary quiz result, save it
        if session_id:
            temp_result = (
                db_session.query(TempQuizResult)
                .filter_by(session_id=session_id)
                .first()
            )
            if temp_result:
                existing_progress = (
                    db_session.query(UserExhibitionProgress)
                    .filter_by(user_id=user.id, exhibition_id=temp_result.exhibition_id)
                    .first()
                )

                if existing_progress:
                    if temp_result.score > existing_progress.score:
                        existing_progress.score = temp_result.score
                        existing_progress.completed = True
                        existing_progress.footpath_id = temp_result.footpath_id
                else:
                    new_progress = UserExhibitionProgress(
                        user_id=user.id,
                        exhibition_id=temp_result.exhibition_id,
                        score=temp_result.score,
                        completed=True,
                        footpath_id=temp_result.footpath_id,
                    )
                    db_session.add(new_progress)

                db_session.commit()
                db_session.delete(temp_result)
                db_session.commit()

        session["user_id"] = user.id
        return jsonify(
            {
                "id": user.id,
                "email": user.email,
                "footpath_name": temp_result.footpath_name if temp_result else None,
            }
        )
    finally:
        db_session.close()


@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id", None)
    return "200"


# route for rendering footpath questions on landing page
@app.route("/api/big-questions", methods=["GET"])
def get_big_questions():
    db_session = SessionLocal()
    try:
        footpaths = db_session.query(
            LearningFootpath.name, LearningFootpath.big_question
        ).all()
        return jsonify({footpath.name: footpath.big_question for footpath in footpaths})
    finally:
        db_session.close()


# route for rendering exhibitions after selecting footpath
@app.route("/api/exhibitions/<footpath_name>", methods=["GET"])
def get_exhibitions_by_footpath(footpath_name):
    db_session = SessionLocal()
    try:
        # Get the footpath and its associated exhibitions using explicit joins
        footpath = (
            db_session.query(LearningFootpath)
            .filter(LearningFootpath.name == footpath_name)
            .first()
        )

        if not footpath:
            return jsonify({"error": "Footpath not found"}), 404

        # Get exhibitions through the many-to-many relationship
        exhibitions = (
            db_session.query(Exhibition)
            .join(footpath_exhibition)
            .join(LearningFootpath)
            .filter(LearningFootpath.name == footpath_name)
            .all()
        )

        return jsonify(
            [
                {
                    "id": exhibition.id,
                    "title": exhibition.title,
                    "description": exhibition.big_question,
                }
                for exhibition in exhibitions
            ]
        )
    finally:
        db_session.close()


# route for collecting questions for each exhibition
@app.route("/api/exhibition-questions/<int:exhibition_id>", methods=["GET"])
def get_exhibition_questions(exhibition_id):
    db_session = SessionLocal()
    try:
        questions = (
            db_session.query(Question).filter_by(exhibition_id=exhibition_id).all()
        )
        return jsonify(
            [
                {
                    "id": q.id,
                    "text": q.text,
                    "option_a": q.option_a,
                    "option_b": q.option_b,
                    "option_c": q.option_c,
                    "option_d": q.option_d,
                    "correct_answer": q.correct_answer,
                }
                for q in questions
            ]
        )
    finally:
        db_session.close()


# route to save exhibition progress
@app.route("/api/save-exhibition-progress", methods=["POST"])
def save_exhibition_progress():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    exhibition_id = request.json.get("exhibitionId")
    score = request.json.get("score")
    completed = request.json.get("completed")

    db_session = SessionLocal()
    try:
        # Check if progress already exists
        existing_progress = (
            db_session.query(UserExhibitionProgress)
            .filter_by(user_id=user_id, exhibition_id=exhibition_id)
            .first()
        )

        if existing_progress:
            # Only update if the new score is higher
            existing_progress.score = max(existing_progress.score, score)
            existing_progress.completed = completed or existing_progress.completed
        else:
            # Create new progress record
            new_progress = UserExhibitionProgress(
                user_id=user_id,
                exhibition_id=exhibition_id,
                score=score,
                completed=completed,
            )
            db_session.add(new_progress)

        db_session.commit()
        return jsonify(
            {
                "status": "success",
                "score": existing_progress.score if existing_progress else score,
            }
        )
    finally:
        db_session.close()


# Route to save temporary quiz result
# @app.route("/save_temp_quiz", methods=["POST"])
# def save_temp_quiz():
#     data = request.get_json()
#     session_id = data.get("session_id")
#     exhibition_id = data.get("exhibition_id")
#     score = data.get("score")
#     footpath_name = data.get("footpath_name")

#     if not session_id or not exhibition_id or score is None:
#         return jsonify({"error": "Invalid data provided"}), 400


#     db_session = SessionLocal()
#     try:
#         temp_result = TempQuizResult(
#             session_id=session_id,
#             exhibition_id=exhibition_id,
#             score=score,
#             footpath_name=footpath_name,
#         )
#         db_session.add(temp_result)
#         db_session.commit()
#         return jsonify({"message": "Temporary quiz result saved successfully"}), 201
#     except Exception as e:
#         db_session.rollback()
#         app.logger.error(f"Error saving temporary quiz result: {e}")
#         return jsonify({"error": "Failed to save temporary quiz result"}), 500
#     finally:
#         db_session.close()
@app.route("/save_temp_quiz", methods=["POST"])
def save_temp_quiz():
    data = request.get_json()
    session_id = data.get("session_id")
    exhibition_id = data.get("exhibition_id")
    score = data.get("score")
    footpath_name = data.get("footpath_name")
    footpath_id = data.get("footpath_id")

    if not all([session_id, exhibition_id, score is not None]):
        return jsonify({"error": "Missing required data"}), 400

    db_session = SessionLocal()
    try:
        # Delete existing temp result if any
        existing_temp = (
            db_session.query(TempQuizResult).filter_by(session_id=session_id).first()
        )
        if existing_temp:
            db_session.delete(existing_temp)

        # Create new temp result
        temp_result = TempQuizResult(
            session_id=session_id,
            exhibition_id=exhibition_id,
            score=score,
            footpath_name=footpath_name,
            footpath_id=footpath_id,
        )
        db_session.add(temp_result)
        db_session.commit()

        return (
            jsonify(
                {
                    "message": "Temporary quiz result saved successfully",
                    "session_id": session_id,
                }
            ),
            201,
        )

    except Exception as e:
        db_session.rollback()
        app.logger.error(f"Error saving temporary quiz result: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        db_session.close()


# Cleanup task for old temporary results (you can run this periodically)
@app.route("/api/cleanup-temp-results", methods=["POST"])
def cleanup_temp_results():
    db_session = SessionLocal()
    try:
        # Delete results older than 24 hours
        cutoff_time = datetime.utcnow() - timedelta(hours=24)
        db_session.query(TempQuizResult).filter(
            TempQuizResult.created_at < cutoff_time
        ).delete()
        db_session.commit()
        return jsonify({"status": "success"})
    finally:
        db_session.close()


# route to track last footpath
@app.route("/api/track-last-footpath", methods=["POST"])
def track_last_footpath():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    footpath_name = request.json.get("footpath_name")

    db_session = SessionLocal()
    try:
        user = db_session.query(User).get(user_id)
        # Logic to store last viewed footpath
        # You might want to add a new column to User model for this
        db_session.commit()
        return jsonify({"status": "success"})
    except Exception as e:
        db_session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db_session.close()


if __name__ == "__main__":

    app.run(debug=True, port=8888)
    print("Database initialized!")
