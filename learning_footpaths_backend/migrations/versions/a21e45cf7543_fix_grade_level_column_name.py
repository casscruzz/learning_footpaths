"""Fix grade level column name

Revision ID: a21e45cf7543
Revises: e5ab38cd395f
Create Date: 2025-02-02 00:38:43.132611

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "a21e45cf7543"
down_revision = "e5ab38cd395f"
branch_labels = None
depends_on = None


def check_constraint_exists(conn, constraint_name, table_name):
    query = sa.text(
        """
        SELECT constraint_name FROM information_schema.table_constraints 
        WHERE table_name = :table_name AND constraint_name = :constraint_name
    """
    )
    result = conn.execute(
        query, {"table_name": table_name, "constraint_name": constraint_name}
    )
    return bool(result.fetchone())


def upgrade():
    # Get database connection
    conn = op.get_bind()

    # Check if the constraint exists before trying to create it
    if not check_constraint_exists(
        conn, "exhibition_grade_levels_grade_level_fkey", "exhibition_grade_levels"
    ):
        # Create the new foreign key constraint
        op.create_foreign_key(
            "exhibition_grade_levels_grade_level_fkey",
            "exhibition_grade_levels",
            "grade_levels",
            ["grade_level"],
            ["grade"],
        )


def downgrade():
    # Get database connection
    conn = op.get_bind()

    # Check if the constraint exists before trying to drop it
    if check_constraint_exists(
        conn, "exhibition_grade_levels_grade_level_fkey", "exhibition_grade_levels"
    ):
        op.drop_constraint(
            "exhibition_grade_levels_grade_level_fkey",
            "exhibition_grade_levels",
            type_="foreignkey",
        )
