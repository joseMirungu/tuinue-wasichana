from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize Flask extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    
    # Configure CORS
    CORS(app, resources={
        r"/*": {
            "origins": [
                "https://tuinue-wasichana-lzf6l5q99-josemirungus-projects.vercel.app",
                "http://localhost:3000"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
            "supports_credentials": True
        }
    })

    # Root route
    @app.route('/')
    def index():
        return jsonify({
            "status": "success",
            "message": "Tuinue Wasichana API is running"
        })

    # Register blueprints
    from app.routes import auth, admin, charity, donor
    app.register_blueprint(auth.bp)
    app.register_blueprint(admin.bp)
    app.register_blueprint(charity.bp)
    app.register_blueprint(donor.bp)
    
    return app