"""Reorganize schedule model by splitting into template and instance tables

Revision ID: 1f17291d55a7
Revises: 12493fc9fc4a
Create Date: 2025-05-08 12:33:17.758693

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '1f17291d55a7'
down_revision: Union[str, None] = '12493fc9fc4a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop FK constraint and schedule_id column from attendances BEFORE dropping schedule
    op.drop_constraint('attendances_schedule_id_fkey', 'attendances', type_='foreignkey')
    op.drop_column('attendances', 'schedule_id')

    # Now drop the old schedule table
    op.drop_table('schedule')

    # Create lesson_templates table
    op.create_table(
        'lesson_templates',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('class_id', sa.Integer(), nullable=False),
        sa.Column('room_id', sa.Integer(), nullable=False),
        sa.Column('teacher_id', sa.Integer(), nullable=False),
        sa.Column('subject', sa.String(), nullable=False),
        sa.Column('weekday', sa.String(), nullable=False),
        sa.Column('start_time', sa.String(), nullable=False),
        sa.Column('end_time', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['class_id'], ['classes.id']),
        sa.ForeignKeyConstraint(['room_id'], ['rooms.id']),
        sa.ForeignKeyConstraint(['teacher_id'], ['teachers.id']),
        sa.PrimaryKeyConstraint('id')
    )

    # Create lesson_instances table
    op.create_table(
        'lesson_instances',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('date', sa.DateTime(), nullable=False),
        sa.Column('template_id', sa.Integer(), nullable=False),
        sa.Column('class_id', sa.Integer(), nullable=False),
        sa.Column('room_id', sa.Integer(), nullable=False),
        sa.Column('teacher_id', sa.Integer(), nullable=False),
        sa.Column('subject', sa.String(), nullable=False),
        sa.Column('start_time', sa.DateTime(), nullable=False),
        sa.Column('end_time', sa.DateTime(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['class_id'], ['classes.id']),
        sa.ForeignKeyConstraint(['room_id'], ['rooms.id']),
        sa.ForeignKeyConstraint(['teacher_id'], ['teachers.id']),
        sa.ForeignKeyConstraint(['template_id'], ['lesson_templates.id']),
        sa.PrimaryKeyConstraint('id')
    )

    # Add lesson_id to attendances and add FK
    op.add_column('attendances', sa.Column('lesson_id', sa.Integer(), nullable=False))
    op.create_foreign_key(None, 'attendances', 'lesson_instances', ['lesson_id'], ['id'])


def downgrade() -> None:
    # Revert attendances to use schedule_id
    op.drop_constraint(None, 'attendances', type_='foreignkey')
    op.drop_column('attendances', 'lesson_id')
    op.add_column('attendances', sa.Column('schedule_id', sa.INTEGER(), nullable=False))
    op.create_foreign_key('attendances_schedule_id_fkey', 'attendances', 'schedule', ['schedule_id'], ['id'])

    # Recreate old schedule table
    op.create_table(
        'schedule',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('class_id', sa.INTEGER(), nullable=False),
        sa.Column('room_id', sa.INTEGER(), nullable=False),
        sa.Column('teacher_id', sa.INTEGER(), nullable=False),
        sa.Column('start_time', postgresql.TIMESTAMP(), nullable=False),
        sa.Column('end_time', postgresql.TIMESTAMP(), nullable=False),
        sa.Column('subject', sa.VARCHAR(), nullable=False),
        sa.Column('created_at', postgresql.TIMESTAMP(), nullable=False),
        sa.Column('updated_at', postgresql.TIMESTAMP(), nullable=False),
        sa.ForeignKeyConstraint(['class_id'], ['classes.id'], name='schedule_class_id_fkey'),
        sa.ForeignKeyConstraint(['room_id'], ['rooms.id'], name='schedule_room_id_fkey'),
        sa.ForeignKeyConstraint(['teacher_id'], ['teachers.id'], name='schedule_teacher_id_fkey'),
        sa.PrimaryKeyConstraint('id', name='schedule_pkey')
    )

    # Drop new tables
    op.drop_table('lesson_instances')
    op.drop_table('lesson_templates')
