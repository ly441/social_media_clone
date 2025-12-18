from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers import PostController

post_bp = Blueprint('posts', __name__, url_prefix='/posts')

# Create a new post
@post_bp.route('/', methods=['POST'])
@jwt_required()
def create_post():
    current_user_id = int(get_jwt_identity())
    return PostController.create_post(current_user_id)

# Get all posts
@post_bp.route('/', methods=['GET'])
@jwt_required()
def get_all_posts():
    current_user_id = int(get_jwt_identity())
    return PostController.get_all_posts(current_user_id)

# Get a single post
@post_bp.route('/<int:post_id>', methods=['GET'])
@jwt_required()
def get_post(post_id):
    current_user_id = int(get_jwt_identity())
    return PostController.get_post(post_id, current_user_id)

# Update a post
@post_bp.route('/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_post(post_id):
    current_user_id = int(get_jwt_identity())
    return PostController.update_post(post_id, current_user_id)

# Delete a post
@post_bp.route('/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    current_user_id = int(get_jwt_identity())
    return PostController.delete_post(post_id, current_user_id)

# Like/unlike a post
@post_bp.route('/<int:post_id>/like', methods=['POST'])
@jwt_required()
def like_post(post_id):
    current_user_id = int(get_jwt_identity())
    return PostController.like_post(post_id, current_user_id)

# Add comment to post
@post_bp.route('/<int:post_id>/comments', methods=['POST'])
@jwt_required()
def add_comment(post_id):
    current_user_id = int(get_jwt_identity())
    return PostController.add_comment(post_id, current_user_id)

# Get post comments
@post_bp.route('/<int:post_id>/comments', methods=['GET'])
@jwt_required()
def get_post_comments(post_id):
    return PostController.get_post_comments(post_id)