from flask import request, jsonify
from app.models.comment import Comment
from app.models.post import Post
from app.extensions import db

class CommentController:
    
    @staticmethod
    def create_comment(post_id, current_user_id):
        try:
            data = request.get_json()
            
            if not data.get('content'):
                return jsonify({'error': 'Content is required'}), 400
            
            # Check if post exists
            post = Post.query.get_or_404(post_id)
            
            comment = Comment(
                content=data['content'],
                user_id=current_user_id,
                post_id=post_id
            )
            
            db.session.add(comment)
            db.session.commit()
            
            return jsonify({
                'message': 'Comment added successfully',
                'comment': comment.to_dict()
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    def get_post_comments(post_id):
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 20, type=int)
            
            comments = Comment.query.filter_by(post_id=post_id)\
                .order_by(Comment.created_at.asc())\
                .paginate(page=page, per_page=per_page, error_out=False)
            
            comments_data = [comment.to_dict() for comment in comments.items]
            
            return jsonify({
                'comments': comments_data,
                'total': comments.total,
                'pages': comments.pages,
                'current_page': page
            }), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    def update_comment(comment_id, current_user_id):
        try:
            comment = Comment.query.get_or_404(comment_id)
            
            if comment.user_id != current_user_id:
                return jsonify({'error': 'Unauthorized'}), 403
            
            data = request.get_json()
            
            if 'content' in data:
                comment.content = data['content']
            
            db.session.commit()
            
            return jsonify({
                'message': 'Comment updated successfully',
                'comment': comment.to_dict()
            }), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    def delete_comment(comment_id, current_user_id):
        try:
            comment = Comment.query.get_or_404(comment_id)
            
            if comment.user_id != current_user_id:
                return jsonify({'error': 'Unauthorized'}), 403
            
            db.session.delete(comment)
            db.session.commit()
            
            return jsonify({'message': 'Comment deleted successfully'}), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500