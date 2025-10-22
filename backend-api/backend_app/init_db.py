"""
Run this script to initialize the database schema.
Usage:
  docker compose exec backend-api python -c "import sys; sys.path.insert(0, '/app'); from app.database import engine; from app.models import Base; Base.metadata.create_all(bind=engine); print('✓ Database tables created successfully.')"
  
Or simpler, add to docker-compose as a one-time command.
"""
import sys
import os

# Ensure parent directory is in path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend_app.database import engine
from backend_app.models import Base

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created successfully.")
