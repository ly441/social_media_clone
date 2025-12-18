from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.comment_controller import CommentController

comment_bp = Blueprint('comments', __name__)

@comment_bp.route('/post/<int:post_id>', methods=['POST'])
@jwt_required()
def create_comment(post_id):
    current_user_id = int(get_jwt_identity())
    return CommentController.create_comment(post_id, current_user_id)

@comment_bp.route('/post/<int:post_id>', methods=['GET'])
@jwt_required()
def get_post_comments(post_id):
    return CommentController.get_post_comments(post_id)

@comment_bp.route('/<int:comment_id>', methods=['PUT'])
@jwt_required()
def update_comment(comment_id):
    current_user_id = int(get_jwt_identity())
    return CommentController.update_comment(comment_id, current_user_id)

@comment_bp.route('/<int:comment_id>', methods=['DELETE'])
@jwt_required()
def delete_comment(comment_id):
    current_user_id = int(get_jwt_identity())
    return CommentController.delete_comment(comment_id, current_user_id)