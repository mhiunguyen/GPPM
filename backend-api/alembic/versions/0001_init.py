"""init tables

Revision ID: 0001_init
Revises: 
Create Date: 2025-10-19 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '0001_init'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'analysis_records',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('risk', sa.String(length=50), nullable=False),
        sa.Column('reason', sa.String(length=500), nullable=True),
        sa.Column('cv_scores', sa.JSON(), nullable=True),
        sa.Column('symptoms_json', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('email', sa.String(length=255), nullable=False, unique=True),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table('users')
    op.drop_table('analysis_records')
