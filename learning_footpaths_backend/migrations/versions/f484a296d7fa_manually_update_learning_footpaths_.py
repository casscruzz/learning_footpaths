"""Manually update learning_footpaths table to include big_question

Revision ID: f484a296d7fa
Revises: 226484d372c7
Create Date: 2024-11-20 22:04:20.252663

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "f484a296d7fa"
down_revision = "226484d372c7"
branch_labels = None
depends_on = None


def upgrade():
    # Add the big_question column
    op.add_column(
        "learning_footpaths", sa.Column("big_question", sa.String(), nullable=True)
    )
    # Remove the description column if it exists
    op.drop_column("learning_footpaths", "description")


def downgrade():
    # Add the description column back
    op.add_column(
        "learning_footpaths", sa.Column("description", sa.String(), nullable=True)
    )
    # Remove the big_question column
    op.drop_column("learning_footpaths", "big_question")
