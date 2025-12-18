
from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers import AuthController

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

# Register new user
@auth_bp.route('/register', methods=['POST'])
def register():
    return AuthController.register()

# Login user
@auth_bp.route('/login', methods=['POST'])
def login():
    return AuthController.login()

# Get current user
@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_id = int(get_jwt_identity())
    return AuthController.get_current_user(current_user_id)

# Refresh token
@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    current_user_id = int(get_jwt_identity())
    return AuthController.refresh_token(current_user_id)

# Logout user
@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    return AuthController.logout()