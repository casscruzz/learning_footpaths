"""empty message

Revision ID: 6c0ba7a3f6e9
Revises: ee2c8795b54a
Create Date: 2024-12-08 16:58:42.031607

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "6c0ba7a3f6e9"
down_revision = "ee2c8795b54a"
branch_labels = None
depends_on = None


# def upgrade():
#     # ### commands auto generated by Alembic - please adjust! ###
#     op.drop_table('learning_footpaths')
#     op.drop_table('footpath_exhibition')
#     op.drop_table('users')
#     op.drop_table('user_exhibition_progress')
#     op.drop_table('questions')
#     op.drop_table('exhibitions')
#     # ### end Alembic commands ###


# def downgrade():
#     # ### commands auto generated by Alembic - please adjust! ###
#     op.create_table('exhibitions',
#     sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('exhibitions_id_seq'::regclass)"), autoincrement=True, nullable=False),
#     sa.Column('title', sa.VARCHAR(), autoincrement=False, nullable=True),
#     sa.Column('big_question', sa.VARCHAR(), autoincrement=False, nullable=True),
#     sa.PrimaryKeyConstraint('id', name='exhibitions_pkey'),
#     postgresql_ignore_search_path=False
#     )
#     op.create_table('questions',
#     sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
#     sa.Column('exhibition_id', sa.INTEGER(), autoincrement=False, nullable=True),
#     sa.Column('text', sa.VARCHAR(), autoincrement=False, nullable=True),
#     sa.Column('option_a', sa.VARCHAR(), autoincrement=False, nullable=True),
#     sa.Column('option_b', sa.VARCHAR(), autoincrement=False, nullable=True),
#     sa.Column('option_c', sa.VARCHAR(), autoincrement=False, nullable=True),
#     sa.Column('option_d', sa.VARCHAR(), autoincrement=False, nullable=True),
#     sa.Column('correct_answer', sa.VARCHAR(), autoincrement=False, nullable=True),
#     sa.ForeignKeyConstraint(['exhibition_id'], ['exhibitions.id'], name='questions_exhibition_id_fkey'),
#     sa.PrimaryKeyConstraint('id', name='questions_pkey')
#     )
#     op.create_table('user_exhibition_progress',
#     sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
#     sa.Column('user_id', sa.VARCHAR(length=32), autoincrement=False, nullable=True),
#     sa.Column('exhibition_id', sa.INTEGER(), autoincrement=False, nullable=True),
#     sa.Column('score', sa.INTEGER(), autoincrement=False, nullable=True),
#     sa.Column('completed', sa.BOOLEAN(), autoincrement=False, nullable=True),
#     sa.ForeignKeyConstraint(['exhibition_id'], ['exhibitions.id'], name='user_exhibition_progress_exhibition_id_fkey'),
#     sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='user_exhibition_progress_user_id_fkey'),
#     sa.PrimaryKeyConstraint('id', name='user_exhibition_progress_pkey')
#     )
#     op.create_table('users',
#     sa.Column('id', sa.VARCHAR(length=32), autoincrement=False, nullable=False),
#     sa.Column('email', sa.VARCHAR(length=345), autoincrement=False, nullable=False),
#     sa.Column('password', sa.TEXT(), autoincrement=False, nullable=False),
#     sa.PrimaryKeyConstraint('id', name='users_pkey'),
#     sa.UniqueConstraint('email', name='users_email_key')
#     )
#     op.create_table('footpath_exhibition',
#     sa.Column('footpath_id', sa.INTEGER(), autoincrement=False, nullable=False),
#     sa.Column('exhibition_id', sa.INTEGER(), autoincrement=False, nullable=False),
#     sa.ForeignKeyConstraint(['exhibition_id'], ['exhibitions.id'], name='footpath_exhibition_exhibition_id_fkey'),
#     sa.ForeignKeyConstraint(['footpath_id'], ['learning_footpaths.id'], name='footpath_exhibition_footpath_id_fkey'),
#     sa.PrimaryKeyConstraint('footpath_id', 'exhibition_id', name='footpath_exhibition_pkey')
#     )
#     op.create_table('learning_footpaths',
#     sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
#     sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=True),
#     sa.Column('big_question', sa.VARCHAR(), autoincrement=False, nullable=True),
#     sa.PrimaryKeyConstraint('id', name='learning_footpaths_pkey'),
#     sa.UniqueConstraint('name', name='learning_footpaths_name_key')
#     )
#     # ### end Alembic commands ###


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "temp_quiz_results",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("session_id", sa.String(length=32), unique=True, nullable=False),
        sa.Column("exhibition_id", sa.Integer(), sa.ForeignKey("exhibitions.id")),
        sa.Column("score", sa.Integer(), default=0),
        sa.Column("footpath_name", sa.String()),
        sa.Column("created_at", sa.DateTime(), default=sa.func.current_timestamp()),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("temp_quiz_results")
    # ### end Alembic commands ###
