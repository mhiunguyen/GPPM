from sqlalchemy import Column, Integer, String, DateTime, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


class AnalysisRecord(Base):
    """Log analysis results (anonymized) for monitoring and improvement."""
    __tablename__ = "analysis_records"

    id = Column(Integer, primary_key=True, index=True)
    risk = Column(String(50), nullable=False)
    reason = Column(String(500), nullable=True)
    cv_scores = Column(JSON, nullable=True)
    symptoms_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class User(Base):
    """User model for future authentication and history features."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
