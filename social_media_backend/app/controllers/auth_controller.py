from flask import request, jsonify
from flask_jwt_extended import create_access_token
from app.models.user import User
from app.extensions import db

class AuthController:
    
    @staticmethod
    def register():
        try:
            data = request.get_json()
            
            # Validation
            if not data.get('username') or not data.get('email') or not data.get('password'):
                return jsonify({'error': 'Missing required fields'}), 400
            
            # Check if user exists
            if User.query.filter_by(username=data['username']).first():
                return jsonify({'error': 'Username already exists'}), 400
            
            if User.query.filter_by(email=data['email']).first():
                return jsonify({'error': 'Email already exists'}), 400
            
            # Create new user
            user = User(
                username=data['username'],
                email=data['email'],
                bio=data.get('bio', '')
            )
            user.set_password(data['password'])
            
            db.session.add(user)
            db.session.commit()
            
            # Create token
            access_token = create_access_token(identity=str(user.id))
            
            return jsonify({
                'message': 'User registered successfully',
                'token': access_token,
                'user': user.to_dict()
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    def login():
        try:
            data = request.get_json()
            
            if not data.get('username') or not data.get('password'):
                return jsonify({'error': 'Missing username or password'}), 400
            
            user = User.query.filter_by(username=data['username']).first()
            
            if not user or not user.check_password(data['password']):
                return jsonify({'error': 'Invalid credentials'}), 401
            
            # Create token
            access_token = create_access_token(identity=str(user.id))
            
            return jsonify({
                'token': access_token,
                'user': user.to_dict()
            }), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @staticmethod
    def get_current_user(current_user_id):
        try:
            user = User.query.get(current_user_id)
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            return jsonify({'user': user.to_dict()}), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500