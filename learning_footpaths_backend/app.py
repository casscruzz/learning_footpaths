from flask import Blueprint, Flask, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_session import Session as FlaskSession
from config import ApplicationConfig
from database import db, SessionLocal  # Base, engine, ,
from models import (
    User,
    Exhibition,
    GradeLevel,
    LearningFootpath,
    CustomBadge,
    UserExhibitionProgress,
    TempQuizResult,
    footpath_exhibition,
    Question,
    exhibition_grade_levels,
    custom_badge_exhibitions,
)
from sqlalchemy.sql import func

from redis import Redis
from datetime import datetime, timedelta
import os
from scoring_utils import get_all_user_footpath_scores
from werkzeug.utils import secure_filename
import json

from routes.scoring import scoring_bp
from routes.account_routes import account_bp


app = Flask(__name__)
app.config.from_object(ApplicationConfig)

app.secret_key = os.getenv("SECRET_KEY")

db.init_app(app)
migrate = Migrate(app, db)

# cors = CORS(
#     app,
#     resources={r"/*": {"origins": "http://localhost:5173"}},
#     supports_credentials=True,
# )
# cors = CORS(
#     app,
#     resources={
#         r"/*": {
#             "origins": "http://localhost:5173",
#             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
#             "allow_headers": ["Content-Type"],
#             "supports_credentials": True,
#         }
#     },
# )
cors = CORS(
    app,
    resources={
        r"/*": {
            "origins": "http://localhost:5173",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True,
            "expose_headers": ["Content-Range", "X-Content-Range"],
        }
    },
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


@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]
    session_id = request.json.get("quiz_session_id")

    db_session = SessionLocal()
    try:
        # First verify user credentials
        user = db_session.query(User).filter_by(email=email).first()

        if user is None or not bcrypt.check_password_hash(user.password, password):
            return jsonify({"error": "Unauthorized"}), 401

        # Set session regardless of quiz completion
        session["user_id"] = user.id
        response_data = {
            "id": user.id,
            "email": user.email,
            "footpath_name": None,
            "footpath_id": None,
        }

        # Handle quiz results if they exist
        if session_id:
            temp_result = (
                db_session.query(TempQuizResult)
                .filter_by(session_id=session_id)
                .first()
            )

            if temp_result:
                # Check for existing progress
                existing_progress = (
                    db_session.query(UserExhibitionProgress)
                    .filter_by(user_id=user.id, exhibition_id=temp_result.exhibition_id)
                    .first()
                )

                if existing_progress:
                    # Update only if new score is higher
                    if temp_result.score > existing_progress.score:
                        existing_progress.score = temp_result.score
                        existing_progress.completed = True
                        existing_progress.footpath_id = temp_result.footpath_id
                else:
                    # Create new progress entry
                    new_progress = UserExhibitionProgress(
                        user_id=user.id,
                        exhibition_id=temp_result.exhibition_id,
                        score=temp_result.score,
                        completed=True,
                        footpath_id=temp_result.footpath_id,
                        timestamp=datetime.utcnow(),
                    )
                    db_session.add(new_progress)

                db_session.commit()

                # Update response data with footpath info
                response_data.update(
                    {
                        "footpath_name": temp_result.footpath_name,
                        "footpath_id": temp_result.footpath_id,
                    }
                )

                # Clean up temp result
                db_session.delete(temp_result)
                db_session.commit()

        return jsonify(response_data)

    except Exception as e:
        db_session.rollback()
        print(f"Login error: {str(e)}")  # For debugging
        return jsonify({"error": "Internal server error"}), 500
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
        # Get the footpath
        footpath = (
            db_session.query(LearningFootpath)
            .filter(LearningFootpath.name == footpath_name)
            .first()
        )

        if not footpath:
            return jsonify({"error": "Footpath not found"}), 404

        # Get exhibitions with their grade levels
        exhibitions = footpath.exhibitions  # Use the relationship directly

        # For debugging
        print(f"Found footpath: {footpath.name}")
        print(f"Number of exhibitions found: {len(exhibitions)}")

        return jsonify(
            [
                {
                    "id": exhibition.id,
                    "title": exhibition.title,
                    "description": exhibition.big_question,
                    "grade_levels": [grade.grade for grade in exhibition.grade_levels],
                    "footpathId": footpath.id,
                }
                for exhibition in exhibitions
            ]
        )
    except Exception as e:
        print(f"Error in get_exhibitions_by_footpath: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        db_session.close()


# route for collecting questions for each exhibition
@app.route("/api/exhibition-questions/<int:exhibition_id>", methods=["GET"])
def get_exhibition_questions(exhibition_id):
    grade_level = request.args.get("grade_level", "10")
    print(f"Fetching questions for exhibition {exhibition_id} and grade {grade_level}")

    db_session = SessionLocal()
    try:
        questions = (
            db_session.query(Question)
            .filter_by(exhibition_id=exhibition_id, grade_level=grade_level)
            .all()
        )

        # Add debug print
        print(f"Found {len(questions)} questions")

        result = [
            {
                "id": q.id,
                "text": q.text,
                "option_a": q.option_a,
                "option_b": q.option_b,
                "option_c": q.option_c,
                "option_d": q.option_d,
                "correct_answer": q.correct_answer,
                "grade_level": q.grade_level,
            }
            for q in questions
        ]

        # Return empty list instead of 404 if no questions found
        return jsonify(result)

    except Exception as e:
        print(f"Error in get_exhibition_questions: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        db_session.close()


# Also add a route to get exhibition score (since we saw a 404 for this endpoint)
@app.route("/api/get-exhibition-score/<int:exhibition_id>", methods=["GET"])
def get_exhibition_score(exhibition_id):
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"score": 0})

    db_session = SessionLocal()
    try:
        progress = (
            db_session.query(UserExhibitionProgress)
            .filter_by(user_id=user_id, exhibition_id=exhibition_id)
            .first()
        )
        return jsonify({"score": progress.score if progress else 0})
    finally:
        db_session.close()


# route to save exhibition progress
@app.route("/api/save-exhibition-progress", methods=["POST"])
def save_exhibition_progress():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    exhibition_id = data.get("exhibitionId")
    score = data.get("score")
    completed = data.get("completed")
    custom_badge_id = data.get("customBadgeId")

    if not all([exhibition_id, score is not None]):
        return jsonify({"error": "Missing required fields"}), 400

    db_session = SessionLocal()
    try:
        # Check if progress already exists for this exhibition and badge combination
        progress = (
            db_session.query(UserExhibitionProgress)
            .filter_by(
                user_id=user_id,
                exhibition_id=exhibition_id,
                custom_badge_id=custom_badge_id,
            )
            .first()
        )

        if progress:
            # Update existing progress if new score is higher
            if score > progress.score:
                progress.score = score
                progress.completed = completed
        else:
            # Create new progress entry
            progress = UserExhibitionProgress(
                user_id=user_id,
                exhibition_id=exhibition_id,
                score=score,
                completed=completed,
                custom_badge_id=custom_badge_id,
            )
            db_session.add(progress)

        db_session.commit()

        # Calculate and return updated total score for the badge
        total_score = (
            db_session.query(func.sum(UserExhibitionProgress.score))
            .filter(
                UserExhibitionProgress.user_id == user_id,
                UserExhibitionProgress.custom_badge_id == custom_badge_id,
            )
            .scalar()
            or 0
        )

        return jsonify(
            {"status": "success", "score": score, "total_score": total_score}
        )

    except Exception as e:
        db_session.rollback()
        print(f"Error saving progress: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        db_session.close()


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


# route to get footpath id
@app.route("/api/footpath-id/<footpath_name>", methods=["GET"])
def get_footpath_id(footpath_name):
    db_session = SessionLocal()
    try:
        footpath = (
            db_session.query(LearningFootpath).filter_by(name=footpath_name).first()
        )
        if footpath:
            return jsonify({"footpath_id": footpath.id})
        return jsonify({"error": "Footpath not found"}), 404
    finally:
        db_session.close()


# get list of completed exhibtitions
@app.route("/api/user/completed-exhibitions", methods=["GET"])
def get_completed_exhibitions():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify([])

    db_session = SessionLocal()
    try:
        completed_exhibitions = (
            db_session.query(UserExhibitionProgress)
            .filter(
                UserExhibitionProgress.user_id == user_id,
                UserExhibitionProgress.completed == True,
            )
            .all()
        )

        return jsonify(
            [
                {
                    "exhibition_id": progress.exhibition_id,
                    "score": progress.score,
                    "timestamp": (
                        progress.timestamp.isoformat() if progress.timestamp else None
                    ),
                }
                for progress in completed_exhibitions
            ]
        )
    finally:
        db_session.close()


# route for getting grade level
@app.route("/api/user/grade-level", methods=["GET"])
def get_user_grade_level():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"grade_level": None}), 200

    db_session = SessionLocal()
    try:
        user = db_session.query(User).get(user_id)
        return jsonify({"grade_level": user.grade_level if user else None})
    finally:
        db_session.close()


# route to fetch exhibitions by grade level for custom badgemaker
@app.route("/api/exhibitions-by-grade/<grade_level>", methods=["GET"])
def get_exhibitions_by_grade(grade_level):
    db_session = SessionLocal()
    try:
        # Get grade level
        grade = db_session.query(GradeLevel).filter_by(grade=grade_level).first()
        if not grade:
            return jsonify({"error": "Grade level not found"}), 404

        # Get all exhibitions for this grade level
        exhibitions = (
            db_session.query(Exhibition)
            .join(exhibition_grade_levels)
            .filter(exhibition_grade_levels.c.grade_level == grade_level)
            .all()
        )

        # For debugging
        print(f"Found {len(exhibitions)} exhibitions for grade {grade_level}")

        return jsonify(
            [
                {
                    "id": exhibition.id,
                    "title": exhibition.title,
                    "description": exhibition.big_question,
                    "grade_levels": [grade.grade for grade in exhibition.grade_levels],
                }
                for exhibition in exhibitions
            ]
        )
    except Exception as e:
        print(f"Error in get_exhibitions_by_grade: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        db_session.close()


# route for creating badge
import os
from werkzeug.utils import secure_filename

# Add this near your other configurations
UPLOAD_FOLDER = "static/badge_images"  # Create this directory
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Make sure the upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route("/api/custom-badges", methods=["POST"])
def create_custom_badge():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        data = request.get_json()
        name = data.get("name")
        description = data.get("description")
        grade_level = data.get("grade_level")
        exhibition_ids = data.get("exhibitions")

        if not all([name, description, grade_level, exhibition_ids]):
            return jsonify({"error": "Missing required fields"}), 400

        db_session = SessionLocal()
        try:
            # Create the custom badge
            new_badge = CustomBadge(
                name=name,
                description=description,
                creator_id=user_id,
                grade_level=grade_level,
                is_public=True,
            )
            db_session.add(new_badge)
            db_session.flush()  # Get the badge ID

            # Add exhibitions to the badge
            exhibitions = (
                db_session.query(Exhibition)
                .filter(Exhibition.id.in_(exhibition_ids))
                .all()
            )
            new_badge.exhibitions.extend(exhibitions)

            db_session.commit()
            return (
                jsonify(
                    {"message": "Badge created successfully", "badge_id": new_badge.id}
                ),
                201,
            )

        except Exception as e:
            print(f"Database error: {str(e)}")
            db_session.rollback()
            raise
        finally:
            db_session.close()

    except Exception as e:
        print(f"Error creating badge: {str(e)}")
        return jsonify({"error": str(e)}), 500


# route to fetch custom badges
@app.route("/api/user/custom-badges", methods=["GET"])
def get_user_custom_badges():
    """Get badges created by the current user with their scores"""
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    db_session = SessionLocal()
    try:
        # Get all custom badges
        badges = db_session.query(CustomBadge).filter_by(creator_id=user_id).all()

        badge_data = []
        for badge in badges:
            # Get progress for all exhibitions in this badge
            total_score = (
                db_session.query(func.sum(UserExhibitionProgress.score))
                .filter(
                    UserExhibitionProgress.user_id == user_id,
                    UserExhibitionProgress.custom_badge_id == badge.id,
                )
                .scalar()
                or 0
            )

            badge_data.append(
                {
                    "id": badge.id,
                    "name": badge.name,
                    "description": badge.description,
                    "grade_level": badge.grade_level,
                    "created_at": badge.created_at.isoformat(),
                    "total_score": total_score,
                    "exhibitions": [
                        {
                            "id": exhibition.id,
                            "title": exhibition.title,
                            "score": next(
                                (
                                    progress.score
                                    for progress in exhibition.user_progress
                                    if progress.user_id == user_id
                                    and progress.custom_badge_id == badge.id
                                ),
                                0,
                            ),
                        }
                        for exhibition in badge.exhibitions
                    ],
                }
            )

        return jsonify(badge_data)
    finally:
        db_session.close()


@app.route("/api/user/discovered-badges", methods=["GET"])
def get_discovered_badges():
    """Get badges discovered/added by the current user"""
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    db_session = SessionLocal()
    try:
        user = db_session.query(User).get(user_id)
        badges = user.discovered_badges

        return jsonify(
            [
                {
                    "id": badge.id,
                    "name": badge.name,
                    "description": badge.description,
                    "badge_image_url": badge.badge_image_url,
                    "grade_level": badge.grade_level,
                    "created_at": badge.created_at.isoformat(),
                    "creator": {"id": badge.creator_id, "email": badge.creator.email},
                }
                for badge in badges
            ]
        )

    finally:
        db_session.close()


@app.route("/api/explore-badges", methods=["GET"])
def explore_badges():
    """Get all public badges for exploration"""
    grade_level = request.args.get("grade_level")

    db_session = SessionLocal()
    try:
        query = db_session.query(CustomBadge).filter_by(is_public=True)

        if grade_level:
            query = query.filter_by(grade_level=grade_level)

        badges = query.all()

        return jsonify(
            [
                {
                    "id": badge.id,
                    "name": badge.name,
                    "description": badge.description,
                    "badge_image_url": badge.badge_image_url,
                    "grade_level": badge.grade_level,
                    "created_at": badge.created_at.isoformat(),
                    "creator": {"id": badge.creator_id, "email": badge.creator.email},
                }
                for badge in badges
            ]
        )

    finally:
        db_session.close()


# more routes for custom badges
@app.route("/api/custom-badge/<int:badge_id>", methods=["GET"])
def get_custom_badge(badge_id):
    """Get a single custom badge with its updated exhibitions"""
    user_id = session.get("user_id")

    db_session = SessionLocal()
    try:
        badge = db_session.query(CustomBadge).get(badge_id)
        if not badge:
            return jsonify({"error": "Badge not found"}), 404

        # Get progress for each exhibition
        exhibition_progress = []
        for exhibition in badge.exhibitions:
            progress = (
                db_session.query(UserExhibitionProgress)
                .filter_by(user_id=user_id, exhibition_id=exhibition.id)
                .first()
            )
            exhibition_data = {
                "id": exhibition.id,
                "title": exhibition.title,
                "description": exhibition.big_question,
                "score": progress.score if progress else 0,
                "completed": progress.completed if progress else False,
            }
            exhibition_progress.append(exhibition_data)

        return jsonify(
            {
                "id": badge.id,
                "name": badge.name,
                "description": badge.description,
                "grade_level": badge.grade_level,
                "exhibitions": exhibition_progress,
                "creator_id": badge.creator_id,
                "created_at": badge.created_at.isoformat(),
            }
        )

    finally:
        db_session.close()


@app.route("/api/custom-badge/<int:badge_id>/completed-exhibitions", methods=["GET"])
def get_custom_badge_progress(badge_id):
    """Get completed exhibitions for a custom badge"""
    user_id = session.get("user_id")
    if not user_id:
        return jsonify([])

    db_session = SessionLocal()
    try:
        completed = (
            db_session.query(UserExhibitionProgress)
            .join(Exhibition)
            .join(custom_badge_exhibitions)
            .filter(
                UserExhibitionProgress.user_id == user_id,
                UserExhibitionProgress.completed == True,
                custom_badge_exhibitions.c.custom_badge_id == badge_id,
            )
            .all()
        )

        return jsonify(
            [
                {
                    "exhibition_id": progress.exhibition_id,
                    "score": progress.score,
                    "timestamp": progress.timestamp.isoformat(),
                }
                for progress in completed
            ]
        )
    finally:
        db_session.close()


# register app.py to new blueprint
app.register_blueprint(scoring_bp)
app.register_blueprint(account_bp)


if __name__ == "__main__":

    app.run(debug=True, port=8888)
    print("Database initialized!")
