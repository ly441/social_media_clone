from flask import request, jsonify
from app.models.post import Post
from app.models.like import Like
from app.models.user import User
from app.models.follow import Follow
from app.extensions import db

class PostController:
    
    @staticmethod
    def create_post(current_user_id):
        try:
            data = request.get_json()
            
            if not data.get('content'):
                return jsonify({'error': 'Content is required'}), 400
            
            post = Post(
                content=data['content'],
                image_url=data.get('image_url'),
                user_id=current_user_id
            )
            
            db.session.add(post)
            db.session.commit()
            
            return jsonify({
                'message': 'Post created successfully',
                'post': post.to_dict(current_user_id)
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    def get_all_posts(current_user_id):
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            
            # Get posts from users the current user follows
            followed_ids = db.session.query(Follow.followed_id)\
                .filter(Follow.follower_id == current_user_id)\
                .subquery()
            
            posts = Post.query.filter(
                (Post.user_id == current_user_id) | 
                (Post.user_id.in_(followed_ids))
            ).order_by(Post.created_at.desc())\
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
    def get_post(post_id, current_user_id):
        try:
            post = Post.query.get_or_404(post_id)
            return jsonify({'post': post.to_dict(current_user_id)}), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    def update_post(post_id, current_user_id):
        try:
            post = Post.query.get_or_404(post_id)
            
            if post.user_id != current_user_id:
                return jsonify({'error': 'Unauthorized'}), 403
            
            data = request.get_json()
            
            if 'content' in data:
                post.content = data['content']
            
            if 'image_url' in data:
                post.image_url = data['image_url']
            
            db.session.commit()
            
            return jsonify({
                'message': 'Post updated successfully',
                'post': post.to_dict(current_user_id)
            }), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    def delete_post(post_id, current_user_id):
        try:
            post = Post.query.get_or_404(post_id)
            
            if post.user_id != current_user_id:
                return jsonify({'error': 'Unauthorized'}), 403
            
            db.session.delete(post)
            db.session.commit()
            
            return jsonify({'message': 'Post deleted successfully'}), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    def like_post(post_id, current_user_id):
        try:
            # Check if already liked
            existing_like = Like.query.filter_by(
                user_id=current_user_id,
                post_id=post_id
            ).first()
            
            if existing_like:
                db.session.delete(existing_like)
                action = 'unliked'
                liked = False
            else:
                like = Like(user_id=current_user_id, post_id=post_id)
                db.session.add(like)
                action = 'liked'
                liked = True
            
            db.session.commit()
            
            # Get updated like count
            post = Post.query.get(post_id)
            
            return jsonify({
                'message': f'Post {action}',
                'liked': liked,
                'likes_count': len(post.likes)
            }), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500