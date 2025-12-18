import re
from datetime import datetime
from flask import request

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_username(username):
    """Validate username format"""
    pattern = r'^[a-zA-Z0-9_]{3,30}$'
    return re.match(pattern, username) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 6:
        return False, "Password must be at least 6 characters long"
    if len(password) > 128:
        return False, "Password is too long (max 128 characters)"
    return True, "Password is valid"

def format_datetime(dt):
    """Format datetime for JSON response"""
    if not dt:
        return None
    return dt.isoformat()

def paginate_query(query, default_per_page=10):
    """Helper function for pagination"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', default_per_page, type=int)
    
    return query.paginate(page=page, per_page=per_page, error_out=False)

def get_client_ip():
    """Get client IP address"""
    if request.environ.get('HTTP_X_FORWARDED_FOR'):
        return request.environ['HTTP_X_FORWARDED_FOR']
    else:
        return request.environ['REMOTE_ADDR']

def sanitize_input(text, max_length=None):
    """Sanitize user input"""
    if not text:
        return ''
    
    # Remove extra whitespace
    text = ' '.join(text.strip().split())
    
    # Truncate if max_length specified
    if max_length and len(text) > max_length:
        text = text[:max_length]
    
    return text