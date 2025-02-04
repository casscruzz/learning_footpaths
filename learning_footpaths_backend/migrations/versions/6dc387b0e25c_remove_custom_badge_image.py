"""Remove custom badge image

Revision ID: 6dc387b0e25c
Revises: 29143b6748cc
Create Date: 2025-02-04 15:15:54.549918

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "6dc387b0e25c"
down_revision = "29143b6748cc"
branch_labels = None
depends_on = None


def upgrade():
    # SQLite and PostgreSQL
    op.alter_column(
        "custom_badges",
        "badge_image_url",
        existing_type=sa.String(length=255),
        nullable=True,
    )


def downgrade():
    # Note: This might fail if there are any NULL values in the column
    op.alter_column(
        "custom_badges",
        "badge_image_url",
        existing_type=sa.String(length=255),
        nullable=False,
    )
