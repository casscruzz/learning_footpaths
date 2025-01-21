from flask import Blueprint, jsonify, request, session
from database import SessionLocal
from models import User
from werkzeug.utils import secure_filename
import os

account_bp = Blueprint("account", __name__)


@account_bp.route("/api/account/profile", methods=["GET"])
def get_profile():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    db_session = SessionLocal()
    try:
        user = db_session.query(User).get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify(
            {
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "grade_level": user.grade_level,
                "profile_photo": user.profile_photo,
            }
        )
    finally:
        db_session.close()


@account_bp.route("/api/account/profile", methods=["PUT"])
def update_profile():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    db_session = SessionLocal()
    try:
        user = db_session.query(User).get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.json
        if "first_name" in data:
            user.first_name = data["first_name"]
        if "last_name" in data:
            user.last_name = data["last_name"]
        if "grade_level" in data:
            user.grade_level = data["grade_level"]

        db_session.commit()
        return jsonify(
            {
                "message": "Profile updated successfully",
                "user": {
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "grade_level": user.grade_level,
                    "profile_photo": user.profile_photo,
                },
            }
        )
    except Exception as e:
        db_session.rollback()
        print(f"Error updating profile: {str(e)}")  # For debugging
        return jsonify({"error": str(e)}), 500
    finally:
        db_session.close()


@account_bp.route("/api/account/profile-photo", methods=["POST"])
def update_profile_photo():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    if "photo" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["photo"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    try:
        if file:
            filename = secure_filename(f"user_{user_id}_{file.filename}")
            upload_folder = os.path.join(os.getcwd(), "static", "profile_photos")

            if not os.path.exists(upload_folder):
                os.makedirs(upload_folder)

            file_path = os.path.join(upload_folder, filename)
            file.save(file_path)

            db_session = SessionLocal()
            try:
                user = db_session.query(User).get(user_id)
                user.profile_photo = filename
                db_session.commit()
                return jsonify(
                    {
                        "message": "Profile photo updated successfully",
                        "profile_photo": filename,
                    }
                )
            finally:
                db_session.close()
    except Exception as e:
        print(f"Error updating profile photo: {str(e)}")  # For debugging
        return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Failed to update profile photo"}), 400
