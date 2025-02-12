"""add badge completion tracking

Revision ID: add_badge_completion_tracking
Revises: add_share_code_to_custom_badges
Create Date: 2024-03-20

"""

from datetime import datetime

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "add_badge_completion_tracking"
down_revision = "add_share_code_to_custom_badges"
branch_labels = None
depends_on = None


def upgrade():
    # Create user_badge_progress table to track overall badge progress
    op.create_table(
        "user_badge_progress",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("user_id", sa.String(32), sa.ForeignKey("users.id"), nullable=False),
        sa.Column(
            "badge_id", sa.Integer, sa.ForeignKey("custom_badges.id"), nullable=False
        ),
        sa.Column("is_discovered", sa.Boolean, default=True, nullable=False),
        sa.Column("is_completed", sa.Boolean, default=False, nullable=False),
        sa.Column("discovered_at", sa.DateTime, default=datetime.utcnow),
        sa.Column("completed_at", sa.DateTime, nullable=True),
        sa.UniqueConstraint("user_id", "badge_id", name="uq_user_badge_progress"),
    )

    # Add indexes for faster lookups
    op.create_index(
        "ix_user_badge_progress_user_id", "user_badge_progress", ["user_id"]
    )
    op.create_index(
        "ix_user_badge_progress_badge_id", "user_badge_progress", ["badge_id"]
    )

    # Add custom_badge_id to user_exhibition_progress if it doesn't exist
    # First check if the column exists
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    columns = [col["name"] for col in inspector.get_columns("user_exhibition_progress")]

    if "custom_badge_id" not in columns:
        op.add_column(
            "user_exhibition_progress",
            sa.Column(
                "custom_badge_id",
                sa.Integer,
                sa.ForeignKey("custom_badges.id"),
                nullable=True,
            ),
        )


def downgrade():
    # Remove the new table and its indexes
    op.drop_index("ix_user_badge_progress_badge_id")
    op.drop_index("ix_user_badge_progress_user_id")
    op.drop_table("user_badge_progress")

    # Don't remove the custom_badge_id column as it might be used by other parts of the application
