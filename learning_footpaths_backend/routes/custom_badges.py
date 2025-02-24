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

        # Return badge with empty exhibitions array for initial state
        return jsonify(
            {
                "message": "Badge added to your collection",
                "badge": {
                    "id": badge.id,
                    "name": badge.name,
                    "description": badge.description,
                    "grade_level": badge.grade_level,
                    "share_code": badge.share_code,
                    "creator": {"id": badge.creator_id, "email": badge.creator.email},
                    "created_at": badge.created_at.isoformat(),
                    "exhibitions": [
                        {"id": ex.id, "title": ex.title, "score": 0}
                        for ex in badge.exhibitions
                    ],
                    "is_completed": False,
                    "completed_at": None,
                },
            }
        )

    except Exception as e:
        db_session.rollback()
        print(f"Error adding discovered badge: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        db_session.close()


@custom_badges_bp.route("/api/user/custom-badges", methods=["GET"])
def get_user_custom_badges():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    db_session = SessionLocal()
    try:
        # Get all custom badges created by the user
        custom_badges = (
            db_session.query(CustomBadge)
            .filter(CustomBadge.creator_id == user_id)
            .all()
        )

        # For each badge, get its exhibitions and progress
        badges_data = []
        for badge in custom_badges:
            # Get all exhibitions for this badge
            exhibitions = []
            for exhibition in badge.exhibitions:
                # Get user's progress for this exhibition
                progress = (
                    db_session.query(UserExhibitionProgress)
                    .filter(
                        UserExhibitionProgress.user_id == user_id,
                        UserExhibitionProgress.exhibition_id == exhibition.id,
                        UserExhibitionProgress.custom_badge_id == badge.id,
                    )
                    .first()
                )

                exhibitions.append(
                    {
                        "id": exhibition.id,
                        "title": exhibition.title,
                        "score": progress.score if progress else 0,
                    }
                )

            # Calculate total points and completion status
            total_points = sum(ex["score"] for ex in exhibitions)
            points_needed = len(badge.exhibitions) * 50
            is_completed = total_points >= points_needed and len(badge.exhibitions) > 0

            badges_data.append(
                {
                    "id": badge.id,
                    "name": badge.name,
                    "description": badge.description,
                    "grade_level": badge.grade_level,
                    "share_code": badge.share_code,
                    "created_at": badge.created_at.isoformat(),
                    "exhibitions": exhibitions,
                    "is_completed": is_completed,
                    "completed_at": (
                        badge.created_at.isoformat() if is_completed else None
                    ),
                }
            )

        return jsonify(badges_data)

    except Exception as e:
        print(f"Error fetching custom badges: {str(e)}")
        return jsonify({"error": "Failed to fetch custom badges"}), 500
    finally:
        db_session.close()


@custom_badges_bp.route("/api/user/discovered-badges", methods=["GET"])
def get_discovered_badges():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    db_session = SessionLocal()
    try:
        # Get all badges discovered by the user (excluding their own badges)
        user = db_session.query(User).filter_by(id=user_id).first()
        discovered_badges = [
            badge for badge in user.discovered_badges if badge.creator_id != user_id
        ]

        badge_data = []
        for badge in discovered_badges:
            # Get progress for all exhibitions in this badge
            exhibition_progress = (
                db_session.query(UserExhibitionProgress)
                .filter(
                    UserExhibitionProgress.user_id == user_id,
                    UserExhibitionProgress.custom_badge_id == badge.id,
                )
                .all()
            )

            # Calculate total points earned
            total_points = sum(progress.score for progress in exhibition_progress)

            # Get completed exhibitions
            completed_exhibitions = [
                progress.exhibition_id
                for progress in exhibition_progress
                if progress.completed
            ]

            # Get all exhibitions with their completion status
            exhibitions_data = []
            for ex in badge.exhibitions:
                progress = next(
                    (p for p in exhibition_progress if p.exhibition_id == ex.id),
                    None,
                )
                exhibitions_data.append(
                    {
                        "id": ex.id,
                        "title": ex.title,
                        "score": progress.score if progress else 0,
                        "completed": ex.id in completed_exhibitions,
                    }
                )

            # Determine if badge is completed
            is_completed = total_points >= badge.points_needed

            badge_data.append(
                {
                    "id": badge.id,
                    "name": badge.name,
                    "description": badge.description,
                    "grade_level": badge.grade_level,
                    "created_at": badge.created_at.isoformat(),
                    "share_code": badge.share_code,
                    "creator": {"id": badge.creator_id, "email": badge.creator.email},
                    "exhibitions": exhibitions_data,
                    "total_points": total_points,
                    "points_needed": badge.points_needed,
                    "is_completed": is_completed,
                    "completed_at": (
                        max(p.timestamp for p in exhibition_progress)
                        if is_completed and exhibition_progress
                        else None
                    ),
                }
            )

        return jsonify(badge_data)

    except Exception as e:
        print(f"Error fetching discovered badges: {str(e)}")
        return jsonify({"error": str(e)}), 500
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

    if not all([exhibition_id, score is not None, custom_badge_id]):
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
            progress.timestamp = datetime.utcnow()
        else:
            # Create new progress entry
            progress = UserExhibitionProgress(
                user_id=user_id,
                exhibition_id=exhibition_id,
                custom_badge_id=custom_badge_id,
                score=score,
                completed=score >= 50,
                timestamp=datetime.utcnow(),
            )
            db_session.add(progress)

        db_session.commit()

        # Calculate completion status for the badge
        badge = db_session.query(CustomBadge).get(custom_badge_id)
        if badge:
            total_exhibitions = len(badge.exhibitions)
            total_points = (
                db_session.query(func.sum(UserExhibitionProgress.score))
                .filter(
                    UserExhibitionProgress.user_id == user_id,
                    UserExhibitionProgress.custom_badge_id == custom_badge_id,
                )
                .scalar()
                or 0
            )
            points_needed = total_exhibitions * 50
            is_completed = total_points >= points_needed and total_exhibitions > 0

            return jsonify(
                {
                    "status": "success",
                    "score": score,
                    "completed": score >= 50,
                    "total_points": total_points,
                    "points_needed": points_needed,
                    "is_completed": is_completed,
                }
            )

        return jsonify({"status": "success", "score": score, "completed": score >= 50})

    except Exception as e:
        db_session.rollback()
        print(f"Error saving progress: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        db_session.close()
