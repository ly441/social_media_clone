from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

# Import blueprints
from app.routes.post_routes import post_bp
from app.routes.user_routes import user_bp
from app.routes.follow_routes import follow_bp

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this in production

# Enable CORS for frontend
CORS(app, supports_credentials=True)

jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(post_bp)
app.register_blueprint(user_bp)
app.register_blueprint(follow_bp)

if __name__ == "__main__":
    app.run(debug=True)
