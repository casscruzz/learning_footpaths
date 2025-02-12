from datetime import datetime

from database import SessionLocal
from flask import Blueprint, jsonify, request, session
from models import CustomBadge, User, UserExhibitionProgress
from sqlalchemy import func

custom_badges_bp = Blueprint("custom_badges", __name__)


@custom_badges_bp.route("/api/discover-badge/<share_code>", methods=["GET"])
def discover_badge(share_code):
    """Find a custom badge by its share code"""
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    db_session = SessionLocal()
    try:
        # Find the badge by share code
        badge = db_session.query(CustomBadge).filter_by(share_code=share_code).first()

        if not badge:
            return jsonify({"error": "Badge not found"}), 404

        # Check if user is the creator
        if badge.creator_id == user_id:
            return jsonify({"error": "You cannot discover your own badge"}), 400

        # Check if user already has this badge
        user = db_session.query(User).get(user_id)
        already_discovered = badge in user.discovered_badges

        # Calculate completion status
        total_exhibitions = len(badge.exhibitions)
        if total_exhibitions == 0:
            completion_percentage = 0
        else:
            completed_exhibitions = (
                db_session.query(UserExhibitionProgress)
                .filter(
                    UserExhibitionProgress.user_id == user_id,
                    UserExhibitionProgress.custom_badge_id == badge.id,
                    UserExhibitionProgress.completed == True,
                )
                .count()
            )
            completion_percentage = (completed_exhibitions / total_exhibitions) * 100

        return jsonify(
            {
                "id": badge.id,
                "name": badge.name,
                "description": badge.description,
                "grade_level": badge.grade_level,
                "creator": {"id": badge.creator_id, "email": badge.creator.email},
                "already_discovered": already_discovered,
                "completion_percentage": completion_percentage,
                "total_exhibitions": total_exhibitions,
                "completed_exhibitions": (
                    completed_exhibitions if total_exhibitions > 0 else 0
                ),
            }
        )

    finally:
        db_session.close()


@custom_badges_bp.route("/api/add-discovered-badge/<share_code>", methods=["POST"])
def add_discovered_badge(share_code):
    """Add a discovered badge to user's collection"""
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    db_session = SessionLocal()
    try:
        # Find the badge
        badge = db_session.query(CustomBadge).filter_by(share_code=share_code).first()
        if not badge:
            return jsonify({"error": "Badge not found"}), 404

        # Check if user is the creator
        if badge.creator_id == user_id:
            return jsonify({"error": "You cannot discover your own badge"}), 400

        # Add badge to user's discovered badges
        user = db_session.query(User).get(user_id)
        if badge in user.discovered_badges:
            return jsonify({"error": "Badge already in your collection"}), 400

        user.discovered_badges.append(badge)

        # Initialize UserExhibitionProgress for each exhibition
        for exhibition in badge.exhibitions:
            progress = UserExhibitionProgress(
                user_id=user_id,
                exhibition_id=exhibition.id,
                custom_badge_id=badge.id,
                score=0,
                completed=False,
            )
            db_session.add(progress)

        db_session.commit()

        return jsonify(
            {
                "message": "Badge added to your collection",
                "badge": {
                    "id": badge.id,
                    "name": badge.name,
                    "description": badge.description,
                    "grade_level": badge.grade_level,
                    "creator": {"id": badge.creator_id, "email": badge.creator.email},
                    "total_exhibitions": len(badge.exhibitions),
                    "completed_exhibitions": 0,
                    "completion_percentage": 0,
                },
            }
        )

    except Exception as e:
        db_session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db_session.close()


@custom_badges_bp.route("/api/user/discovered-badges", methods=["GET"])
def get_discovered_badges():
    """Get all badges discovered by the user with their progress"""
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    db_session = SessionLocal()
    try:
        # Get user's discovered badges
        user = db_session.query(User).get(user_id)
        discovered_badges = []

        for badge in user.discovered_badges:
            # Skip if user is the creator
            if badge.creator_id == user_id:
                continue

            # Get exhibition progress for this badge
            exhibition_progress = []
            total_completed = 0

            for exhibition in badge.exhibitions:
                ex_progress = (
                    db_session.query(UserExhibitionProgress)
                    .filter(
                        UserExhibitionProgress.user_id == user_id,
                        UserExhibitionProgress.exhibition_id == exhibition.id,
                        UserExhibitionProgress.custom_badge_id == badge.id,
                    )
                    .first()
                )

                completed = ex_progress.completed if ex_progress else False
                if completed:
                    total_completed += 1

                exhibition_progress.append(
                    {
                        "id": exhibition.id,
                        "title": exhibition.title,
                        "description": exhibition.big_question,
                        "completed": completed,
                    }
                )

            # Calculate completion percentage
            total_exhibitions = len(badge.exhibitions)
            completion_percentage = (
                (total_completed / total_exhibitions) * 100
                if total_exhibitions > 0
                else 0
            )

            discovered_badges.append(
                {
                    "id": badge.id,
                    "name": badge.name,
                    "description": badge.description,
                    "grade_level": badge.grade_level,
                    "creator": {"id": badge.creator_id, "email": badge.creator.email},
                    "total_exhibitions": total_exhibitions,
                    "completed_exhibitions": total_completed,
                    "completion_percentage": completion_percentage,
                    "exhibitions": exhibition_progress,
                    "created_at": (
                        badge.created_at.isoformat() if badge.created_at else None
                    ),
                    "share_code": badge.share_code,
                }
            )

        return jsonify(discovered_badges)

    except Exception as e:
        print(f"Error getting discovered badges: {str(e)}")
        return jsonify({"error": "Failed to fetch discovered badges"}), 500
    finally:
        db_session.close()


@custom_badges_bp.route("/api/save-exhibition-progress", methods=["POST"])
def save_exhibition_progress():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    exhibition_id = data.get("exhibitionId")
    score = data.get("score")
    custom_badge_id = data.get("customBadgeId")

    if not all([exhibition_id, score is not None]):
        return jsonify({"error": "Missing required fields"}), 400

    db_session = SessionLocal()
    try:
        # Update exhibition progress
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
            # Update existing progress
            progress.score = score
            progress.completed = score >= 50
        else:
            # Create new progress entry
            progress = UserExhibitionProgress(
                user_id=user_id,
                exhibition_id=exhibition_id,
                score=score,
                completed=score >= 50,
                custom_badge_id=custom_badge_id,
            )
            db_session.add(progress)

        db_session.commit()

        # Calculate completion status for the badge
        if custom_badge_id:
            badge = db_session.query(CustomBadge).get(custom_badge_id)
            total_exhibitions = len(badge.exhibitions)
            completed_exhibitions = (
                db_session.query(UserExhibitionProgress)
                .filter(
                    UserExhibitionProgress.user_id == user_id,
                    UserExhibitionProgress.custom_badge_id == custom_badge_id,
                    UserExhibitionProgress.completed == True,
                )
                .count()
            )
            completion_percentage = (
                (completed_exhibitions / total_exhibitions) * 100
                if total_exhibitions > 0
                else 0
            )

            return jsonify(
                {
                    "status": "success",
                    "score": score,
                    "completed": score >= 50,
                    "total_exhibitions": total_exhibitions,
                    "completed_exhibitions": completed_exhibitions,
                    "completion_percentage": completion_percentage,
                }
            )

        return jsonify({"status": "success", "score": score, "completed": score >= 50})

    except Exception as e:
        db_session.rollback()
        print(f"Error saving progress: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        db_session.close()
