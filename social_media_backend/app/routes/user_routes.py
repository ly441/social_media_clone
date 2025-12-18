from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.user_controller import UserController

user_bp = Blueprint('users', __name__)

@user_bp.route('/', methods=['GET'])
@jwt_required()
def search_users():
    return UserController.search_users()

@user_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    current_user_id = int(get_jwt_identity())
    return UserController.get_user(user_id, current_user_id)

@user_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    current_user_id = int(get_jwt_identity())
    return UserController.update_user(user_id, current_user_id)

@user_bp.route('/<int:user_id>/posts', methods=['GET'])
@jwt_required()
def get_user_posts(user_id):
    current_user_id = int(get_jwt_identity())
    return UserController.get_user_posts(user_id, current_user_id)