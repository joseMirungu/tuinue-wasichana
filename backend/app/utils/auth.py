from flask_jwt_extended import create_access_token, get_jwt_identity
from datetime import timedelta

def generate_access_token(user_id):
    """Generate a JWT access token for a user."""
    return create_access_token(identity=user_id, expires_delta=timedelta(days=1))

def get_current_user():
    """Retrieve the current user ID from the JWT token."""
    return get_jwt_identity()
