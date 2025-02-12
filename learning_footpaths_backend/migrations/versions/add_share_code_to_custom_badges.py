"""add share code to custom badges

Revision ID: add_share_code_to_custom_badges
Revises: 6dc387b0e25c
Create Date: 2024-03-19

"""

import random
import string

import sqlalchemy as sa
from alembic import op
from sqlalchemy import text

# revision identifiers, used by Alembic.
revision = "add_share_code_to_custom_badges"
down_revision = "6dc387b0e25c"
branch_labels = None
depends_on = None


def generate_share_code():
    """Generate a random 5-character code using uppercase letters and numbers"""
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=5))


def upgrade():
    # Add share_code column as nullable initially
    op.add_column("custom_badges", sa.Column("share_code", sa.String(5), nullable=True))

    # Create a bind to execute SQL
    bind = op.get_bind()

    # Get all existing badges
    badges = bind.execute(
        text("SELECT id FROM custom_badges WHERE share_code IS NULL")
    ).fetchall()

    # Generate and update share codes for existing badges
    for badge in badges:
        while True:
            share_code = generate_share_code()
            # Check if code is unique
            exists = bind.execute(
                text("SELECT 1 FROM custom_badges WHERE share_code = :code"),
                {"code": share_code},
            ).fetchone()
            if not exists:
                bind.execute(
                    text("UPDATE custom_badges SET share_code = :code WHERE id = :id"),
                    {"code": share_code, "id": badge[0]},
                )
                break

    # Now make the column unique and not nullable
    op.create_unique_constraint(
        "uq_custom_badges_share_code", "custom_badges", ["share_code"]
    )
    op.alter_column("custom_badges", "share_code", nullable=False)

    # Create an index for faster lookups
    op.create_index("ix_custom_badges_share_code", "custom_badges", ["share_code"])


def downgrade():
    # Remove the index first
    op.drop_index("ix_custom_badges_share_code")

    # Remove the unique constraint
    op.drop_constraint("uq_custom_badges_share_code", "custom_badges")

    # Then remove the column
    op.drop_column("custom_badges", "share_code")
