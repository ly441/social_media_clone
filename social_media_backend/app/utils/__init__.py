from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from .config import Config
from .extensions import db, jwt
from .routes import register_blueprints

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)
    Migrate(app, db)
    
    # Register blueprints
    register_blueprints(app)
    
    return app