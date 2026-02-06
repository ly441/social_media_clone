# run.py (or app/__init__.py)
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from app.extensions import db, jwt

migrate = Migrate()  # create migrate instance here

def create_app():
    app = Flask(__name__)

    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1234@localhost:5432/social_media_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'your-secret-key-here'
    app.config["JWT_SECRET_KEY"] = "super-secret-key"  # needed for flask_jwt_extended

    # Enable CORS
    CORS(
        app,
        supports_credentials=True,
        origins=["http://localhost:5184"],  # React dev server
        methods=["GET", "POST", "PUT", "DELETE"],
        allow_headers=["Content-Type", "Authorization"]
    )

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # Import models so SQLAlchemy knows about them
    from app import models

    # Register blueprints
    from app.routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp)

    # Simple test route
    @app.route("/")
    def home():
        return "Welcome to the Social Media API!"

    return app
