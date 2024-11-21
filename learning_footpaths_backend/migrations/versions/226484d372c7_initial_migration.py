"""Initial migration.

Revision ID: 226484d372c7
Revises: 
Create Date: 2024-11-20 21:40:41.471728

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '226484d372c7'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('users')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.VARCHAR(length=32), nullable=False),
    sa.Column('email', sa.VARCHAR(length=345), nullable=False),
    sa.Column('password', sa.TEXT(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('id')
    )
    # ### end Alembic commands ###