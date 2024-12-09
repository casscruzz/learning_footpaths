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

from flask import Blueprint, jsonify, session
from database import SessionLocal
from models import LearningFootpath, UserExhibitionProgress, footpath_exhibition
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
            }
            for score in user_scores
        ]

        return jsonify(scores_data)
    except Exception as e:
        print(f"Error fetching scores: {str(e)}")  # For debugging
        return jsonify({"error": "Failed to fetch scores"}), 500
    finally:
        db_session.close()
