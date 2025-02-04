"""Add custom badge tables

Revision ID: b2b10f5cf64c
Revises: a21e45cf7543
Create Date: 2025-02-04 12:51:19.655250

"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "b2b10f5cf64c"
down_revision = "a21e45cf7543"
branch_labels = None
depends_on = None


def upgrade():
    # Create custom_badges table
    op.create_table(
        "custom_badges",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("badge_image_url", sa.String(length=255), nullable=False),
        sa.Column("creator_id", sa.String(length=32), nullable=False),
        sa.Column("grade_level", sa.String(length=2), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("is_public", sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(
            ["creator_id"],
            ["users.id"],
        ),
        sa.ForeignKeyConstraint(
            ["grade_level"],
            ["grade_levels.grade"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    # Create custom_badge_exhibitions association table
    op.create_table(
        "custom_badge_exhibitions",
        sa.Column("custom_badge_id", sa.Integer(), nullable=False),
        sa.Column("exhibition_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["custom_badge_id"],
            ["custom_badges.id"],
        ),
        sa.ForeignKeyConstraint(
            ["exhibition_id"],
            ["exhibitions.id"],
        ),
        sa.PrimaryKeyConstraint("custom_badge_id", "exhibition_id"),
    )

    # Create user_custom_badges association table
    op.create_table(
        "user_custom_badges",
        sa.Column("user_id", sa.String(length=32), nullable=False),
        sa.Column("custom_badge_id", sa.Integer(), nullable=False),
        sa.Column("added_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(
            ["custom_badge_id"],
            ["custom_badges.id"],
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
        ),
        sa.PrimaryKeyConstraint("user_id", "custom_badge_id"),
    )


def downgrade():
    # Drop tables in reverse order of creation
    op.drop_table("user_custom_badges")
    op.drop_table("custom_badge_exhibitions")
    op.drop_table("custom_badges")
