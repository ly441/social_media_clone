from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.follow_controller import FollowController

follow_bp = Blueprint('follow', __name__)

@follow_bp.route('/user/<int:user_id>', methods=['POST'])
@jwt_required()
def follow_user(user_id):
    current_user_id = int(get_jwt_identity())
    return FollowController.follow_user(user_id, current_user_id)

@follow_bp.route('/<int:user_id>/followers', methods=['GET'])
@jwt_required()
def get_followers(user_id):
    return FollowController.get_followers(user_id)

@follow_bp.route('/<int:user_id>/following', methods=['GET'])
@jwt_required()
def get_following(user_id):
    return FollowController.get_following(user_id)