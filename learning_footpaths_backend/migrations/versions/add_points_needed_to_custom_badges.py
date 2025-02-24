"""add points needed to custom badges

Revision ID: points_needed
Revises: add_badge_completion_tracking
Create Date: 2024-03-21

"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy import text

# revision identifiers, used by Alembic.
revision = "points_needed"
down_revision = "add_badge_completion_tracking"
branch_labels = None
depends_on = None


def upgrade():
    # Add points_needed column
    op.add_column(
        "custom_badges", sa.Column("points_needed", sa.Integer, nullable=True)
    )

    # Create a bind to execute SQL
    bind = op.get_bind()

    # Update points_needed for existing badges based on number of exhibitions
    bind.execute(
        text(
            """
        UPDATE custom_badges 
        SET points_needed = (
            SELECT COUNT(*) * 50 
            FROM custom_badge_exhibitions 
            WHERE custom_badge_exhibitions.custom_badge_id = custom_badges.id
        )
        """
        )
    )

    # Make the column not nullable after setting initial values
    op.alter_column(
        "custom_badges", "points_needed", existing_type=sa.Integer(), nullable=False
    )


def downgrade():
    op.drop_column("custom_badges", "points_needed")
