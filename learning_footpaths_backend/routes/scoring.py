# from flask import Blueprint, jsonify
# from database import SessionLocal
# from models import LearningFootpath
# from scoring_utils import get_all_user_footpath_scores

# scoring_bp = Blueprint("scoring", __name__)


# @scoring_bp.route("/api/user/footpath-scores", methods=["GET"])
# def get_user_footpath_scores():
#     user_id = session.get("user_id")
#     if not user_id:
#         return jsonify({"error": "Unauthorized"}), 401

#     db_session = SessionLocal()
#     try:
#         # Get raw scores
#         scores = get_all_user_footpath_scores(db_session, user_id)

#         # Get footpath details to include names
#         footpath_details = {}
#         for score in scores:
#             footpath = db_session.query(LearningFootpath).get(score["footpath_id"])
#             if footpath:
#                 footpath_details[score["footpath_id"]] = footpath.name

#         # Combine scores with footpath names
#         detailed_scores = [
#             {
#                 "footpath_id": score["footpath_id"],
#                 "footpath_name": footpath_details.get(score["footpath_id"], "Unknown"),
#                 "total_score": score["total_score"],
#             }
#             for score in scores
#         ]

#         return jsonify(detailed_scores)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
#     finally:
#         db_session.close()

import logging
from datetime import datetime

from database import SessionLocal
from flask import Blueprint, jsonify, request, session
from models import (
    CustomBadge,
    Exhibition,
    LearningFootpath,
    User,
    UserExhibitionProgress,
    footpath_exhibition,
)
from sqlalchemy import func

scoring_bp = Blueprint("scoring", __name__)


@scoring_bp.route("/api/user/footpath-scores", methods=["GET"])
def get_user_footpath_scores():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    db_session = SessionLocal()
    try:
        # Get all footpaths where user has any exhibition progress
        user_scores = (
            db_session.query(
                footpath_exhibition.c.footpath_id,
                LearningFootpath.name.label("footpath_name"),
                func.sum(UserExhibitionProgress.score).label("total_score"),
                func.max(UserExhibitionProgress.timestamp).label("completion_date"),
            )
            .join(
                UserExhibitionProgress,
                UserExhibitionProgress.exhibition_id
                == footpath_exhibition.c.exhibition_id,
            )
            .join(
                LearningFootpath,
                LearningFootpath.id == footpath_exhibition.c.footpath_id,
            )
            .filter(UserExhibitionProgress.user_id == user_id)
            .group_by(footpath_exhibition.c.footpath_id, LearningFootpath.name)
            .all()
        )

        # Format the results
        scores_data = [
            {
                "footpath_id": score[0],
                "footpath_name": score[1],
                "total_score": int(score[2] or 0),
                "completion_date": score[3].isoformat() if score[3] else None,
            }
            for score in user_scores
        ]

        return jsonify(scores_data)
    except Exception as e:
        print(f"Error fetching scores: {str(e)}")  # For debugging
        return jsonify({"error": "Failed to fetch scores"}), 500
    finally:
        db_session.close()


# route for calculating points per footpath
POINTS_NEEDED_FOR_BADGE = 150


@scoring_bp.route("/api/footpath-progress/<int:footpath_id>", methods=["GET"])
def get_footpath_progress(footpath_id):
    user_id = session.get("user_id")

    # Debug logging
    logging.debug(
        f"Fetching progress for user_id: {user_id}, footpath_id: {footpath_id}"
    )

    if not user_id:
        return jsonify({"error": "User not authenticated"}), 401

    db_session = SessionLocal()
    try:
        # Verify footpath exists
        footpath = db_session.query(LearningFootpath).get(footpath_id)
        if not footpath:
            return jsonify({"error": "Footpath not found"}), 404

        # Get all exhibitions for this footpath
        footpath_exhibitions = (
            db_session.query(Exhibition.id)
            .join(footpath_exhibition)
            .filter(footpath_exhibition.c.footpath_id == footpath_id)
            .all()
        )

        exhibition_ids = [ex[0] for ex in footpath_exhibitions]

        if not exhibition_ids:
            return jsonify(
                {
                    "total_points": 0,
                    "points_needed": POINTS_NEEDED_FOR_BADGE,
                    "points_remaining": POINTS_NEEDED_FOR_BADGE,
                    "progress_percentage": 0,
                    "footpath_name": footpath.name,
                }
            )

        # Calculate total points
        total_points = (
            db_session.query(func.sum(UserExhibitionProgress.score))
            .filter(
                UserExhibitionProgress.user_id == user_id,
                UserExhibitionProgress.exhibition_id.in_(exhibition_ids),
            )
            .scalar()
        ) or 0

        return jsonify(
            {
                "total_points": total_points,
                "points_needed": POINTS_NEEDED_FOR_BADGE,
                "points_remaining": max(0, POINTS_NEEDED_FOR_BADGE - total_points),
                "progress_percentage": min(
                    100, (total_points / POINTS_NEEDED_FOR_BADGE) * 100
                ),
                "footpath_name": footpath.name,
            }
        )

    except Exception as e:
        logging.error(f"Error in get_footpath_progress: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        db_session.close()


# endpoint to count earned badges
@scoring_bp.route("/api/user/badge-count", methods=["GET"])
def get_user_badge_count():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"badge_count": 0})

    db_session = SessionLocal()
    try:
        # Get completed footpath badges count
        footpath_badges = (
            db_session.query(
                footpath_exhibition.c.footpath_id,
                func.sum(UserExhibitionProgress.score).label("total_score"),
            )
            .join(
                UserExhibitionProgress,
                UserExhibitionProgress.exhibition_id
                == footpath_exhibition.c.exhibition_id,
            )
            .filter(UserExhibitionProgress.user_id == user_id)
            .group_by(footpath_exhibition.c.footpath_id)
            .having(func.sum(UserExhibitionProgress.score) >= POINTS_NEEDED_FOR_BADGE)
            .count()
        )

        # Get completed custom badges count
        custom_badges = (
            db_session.query(CustomBadge)
            .join(
                UserExhibitionProgress,
                UserExhibitionProgress.custom_badge_id == CustomBadge.id,
            )
            .filter(CustomBadge.creator_id == user_id)
            .group_by(CustomBadge.id)
            .having(
                func.sum(UserExhibitionProgress.score)
                >= func.count(UserExhibitionProgress.exhibition_id)
                * 50  # Each exhibition needs 50 points
            )
            .count()
        )

        total_badge_count = footpath_badges + custom_badges

        return jsonify(
            {"badge_count": total_badge_count, "points_needed": POINTS_NEEDED_FOR_BADGE}
        )

    except Exception as e:
        print(f"Error getting badge count: {str(e)}")
        return jsonify({"error": "Failed to fetch badge count"}), 500
    finally:
        db_session.close()


@scoring_bp.route("/api/save-exhibition-progress", methods=["POST"])
def save_exhibition_progress():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    exhibition_id = data.get("exhibition_id")
    score = data.get("score")
    custom_badge_id = data.get("custom_badge_id")  # Get custom_badge_id from request

    if not exhibition_id or score is None:
        return jsonify({"error": "Missing required data"}), 400

    db_session = SessionLocal()
    try:
        # Check if progress already exists
        progress = (
            db_session.query(UserExhibitionProgress)
            .filter(
                UserExhibitionProgress.user_id == user_id,
                UserExhibitionProgress.exhibition_id == exhibition_id,
                UserExhibitionProgress.custom_badge_id
                == custom_badge_id,  # Include in filter
            )
            .first()
        )

        if progress:
            # Update existing progress
            progress.score = score
            progress.timestamp = datetime.utcnow()
        else:
            # Create new progress entry
            progress = UserExhibitionProgress(
                user_id=user_id,
                exhibition_id=exhibition_id,
                custom_badge_id=custom_badge_id,  # Include in new entry
                score=score,
                timestamp=datetime.utcnow(),
            )
            db_session.add(progress)

        db_session.commit()
        return jsonify({"message": "Progress saved successfully"})

    except Exception as e:
        db_session.rollback()
        print(f"Error saving progress: {str(e)}")
        return jsonify({"error": "Failed to save progress"}), 500
    finally:
        db_session.close()
