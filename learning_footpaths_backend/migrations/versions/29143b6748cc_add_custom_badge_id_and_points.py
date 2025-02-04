"""Add custom badge id and points

Revision ID: 29143b6748cc
Revises: b2b10f5cf64c
Create Date: 2025-02-04 15:03:16.805265

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "29143b6748cc"
down_revision = "b2b10f5cf64c"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "user_exhibition_progress",
        sa.Column("custom_badge_id", sa.Integer(), nullable=True),
    )
    op.create_foreign_key(
        "fk_user_exhibition_progress_custom_badge",
        "user_exhibition_progress",
        "custom_badges",
        ["custom_badge_id"],
        ["id"],
    )


def downgrade():
    op.drop_constraint(
        "fk_user_exhibition_progress_custom_badge",
        "user_exhibition_progress",
        type_="foreignkey",
    )
    op.drop_column("user_exhibition_progress", "custom_badge_id")
