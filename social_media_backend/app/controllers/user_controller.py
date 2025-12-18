from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity
from app.models.user import User
from app.models.post import Post
from app.models.follow import Follow
from app.extensions import db

class UserController:
    
    @staticmethod
    def get_user(user_id, current_user_id):
        try:
            user = User.query.get_or_404(user_id)
            
            # Check if current user is following this user
            is_following = False
            if current_user_id != user_id:
                follow = Follow.query.filter_by(
                    follower_id=current_user_id,
                    followed_id=user_id
                ).first()
                is_following = follow is not None
            
            user_data = user.to_dict()
            user_data['is_following'] = is_following
            user_data['is_self'] = current_user_id == user_id
            
            return jsonify({'user': user_data}), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    def update_user(user_id, current_user_id):
        try:
            if int(user_id) != current_user_id:
                return jsonify({'error': 'Unauthorized'}), 403
            
            user = User.query.get_or_404(user_id)
            data = request.get_json()
            
            # Update fields if provided
            if 'username' in data:
                # Check if username is taken by another user
                existing_user = User.query.filter(
                    User.username == data['username'],
                    User.id != user_id
                ).first()
                if existing_user:
                    return jsonify({'error': 'Username already taken'}), 400
                user.username = data['username']
            
            if 'email' in data:
                # Check if email is taken by another user
                existing_user = User.query.filter(
                    User.email == data['email'],
                    User.id != user_id
                ).first()
                if existing_user:
                    return jsonify({'error': 'Email already taken'}), 400
                user.email = data['email']
            
            if 'bio' in data:
                user.bio = data['bio']
            
            if 'profile_picture' in data:
                user.profile_picture = data['profile_picture']
            
            db.session.commit()
            
            return jsonify({
                'message': 'User updated successfully',
                'user': user.to_dict()
            }), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    def get_user_posts(user_id, current_user_id):
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            
            posts = Post.query.filter_by(user_id=user_id)\
                .order_by(Post.created_at.desc())\
                .paginate(page=page, per_page=per_page, error_out=False)
            
            posts_data = [post.to_dict(current_user_id) for post in posts.items]
            
            return jsonify({
                'posts': posts_data,
                'total': posts.total,
                'pages': posts.pages,
                'current_page': page
            }), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    def search_users():
        try:
            query = request.args.get('q', '')
            if not query:
                return jsonify({'users': []}), 200
            
            users = User.query.filter(
                User.username.ilike(f'%{query}%') | 
                User.email.ilike(f'%{query}%')
            ).limit(20).all()
            
            users_data = [user.to_dict() for user in users]
            
            return jsonify({'users': users_data}), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500