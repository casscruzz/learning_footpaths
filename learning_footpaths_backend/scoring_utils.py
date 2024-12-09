from sqlalchemy import func
from models import UserExhibitionProgress, footpath_exhibition, Exhibition


def calculate_footpath_score(db_session, user_id, footpath_id):
    """
    Calculate total score for a user in a specific footpath.
    """
    total_score = (
        db_session.query(func.sum(UserExhibitionProgress.score))
        .join(Exhibition, UserExhibitionProgress.exhibition_id == Exhibition.id)
        .join(footpath_exhibition, Exhibition.id == footpath_exhibition.c.exhibition_id)
        .filter(
            UserExhibitionProgress.user_id == user_id,
            footpath_exhibition.c.footpath_id == footpath_id,
        )
        .scalar()
    )

    return total_score or 0


def get_all_user_footpath_scores(db_session, user_id):
    """
    Get scores for all footpaths a user has participated in.
    Returns a list of dictionaries containing footpath info and scores.
    """
    # Get all footpaths where user has any exhibition progress
    scores = (
        db_session.query(
            footpath_exhibition.c.footpath_id,
            func.sum(UserExhibitionProgress.score).label("total_score"),
        )
        .join(
            UserExhibitionProgress,
            UserExhibitionProgress.exhibition_id == footpath_exhibition.c.exhibition_id,
        )
        .filter(UserExhibitionProgress.user_id == user_id)
        .group_by(footpath_exhibition.c.footpath_id)
        .all()
    )

    return [{"footpath_id": score[0], "total_score": score[1] or 0} for score in scores]
