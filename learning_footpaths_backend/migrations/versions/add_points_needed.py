"""add points needed

Revision ID: add_points_needed
Revises: add_badge_completion_tracking
Create Date: 2024-03-21

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "add_points_needed"
down_revision = "add_badge_completion_tracking"
branch_labels = None
depends_on = None


def upgrade():
    # Add points_needed column with a default value of 0
    op.add_column(
        "custom_badges",
        sa.Column("points_needed", sa.Integer(), nullable=False, server_default="0"),
    )

    # Update points_needed for existing badges
    op.execute(
        """
        UPDATE custom_badges 
        SET points_needed = (
            SELECT COUNT(*) * 50 
            FROM custom_badge_exhibitions 
            WHERE custom_badge_exhibitions.custom_badge_id = custom_badges.id
        )
    """
    )


def downgrade():
    op.drop_column("custom_badges", "points_needed")
