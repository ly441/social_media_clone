
from app.models.user import User
from app.models.post import Post
from app.models.comment import Comment
from app.models.like import Like
from app.models.follow import Follow

# This makes them available when you do "from app import models"
__all__ = ['User', 'Post', 'Comment', 'Like', 'Follow']