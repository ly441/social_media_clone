from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

def admin_required(f):
    """Decorator to require admin role"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        verify_jwt_in_request()
        current_user_id = get_jwt_identity()
        # Add your admin check logic here
        # For now, just pass through
        return f(*args, **kwargs)
    return decorated_function

def get_current_user_id():
    """Get current user ID from JWT token"""
    try:
        verify_jwt_in_request()
        return int(get_jwt_identity())
    except:
        return None