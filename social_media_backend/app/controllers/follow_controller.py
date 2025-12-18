from flask import request, jsonify
from app.models.follow import Follow
from app.models.user import User
from app.extensions import db

class FollowController:
    
    @staticmethod
    def follow_user(user_id, current_user_id):
        try:
            if user_id == current_user_id:
                return jsonify({'error': 'Cannot follow yourself'}), 400
            
            # Check if user exists
            user_to_follow = User.query.get_or_404(user_id)
            
            # Check if already following
            existing_follow = Follow.query.filter_by(
                follower_id=current_user_id,
                followed_id=user_id
            ).first()
            
            if existing_follow:
                db.session.delete(existing_follow)
                action = 'unfollowed'
                following = False
            else:
                follow = Follow(
                    follower_id=current_user_id,
                    followed_id=user_id
                )
                db.session.add(follow)
                action = 'followed'
                following = True
            
            db.session.commit()
            
            return jsonify({
                'message': f'User {action}',
                'following': following
            }), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    def get_followers(user_id):
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 20, type=int)
            
            followers = Follow.query.filter_by(followed_id=user_id)\
                .order_by(Follow.created_at.desc())\
                .paginate(page=page, per_page=per_page, error_out=False)
            
            followers_data = [{
                'user': follow.follower.to_dict(),
                'followed_at': follow.created_at.isoformat()
            } for follow in followers.items]
            
            return jsonify({
                'followers': followers_data,
                'total': followers.total,
                'pages': followers.pages,
                'current_page': page
            }), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    def get_following(user_id):
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 20, type=int)
            
            following = Follow.query.filter_by(follower_id=user_id)\
                .order_by(Follow.created_at.desc())\
                .paginate(page=page, per_page=per_page, error_out=False)
            
            following_data = [{
                'user': follow.followed.to_dict(),
                'followed_at': follow.created_at.isoformat()
            } for follow in following.items]
            
            return jsonify({
                'following': following_data,
                'total': following.total,
                'pages': following.pages,
                'current_page': page
            }), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500