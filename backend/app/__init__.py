from flask import Flask, jsonify, request  # Added request import
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
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    
    # Configure CORS with production domains
    CORS(app, 
         resources={r"/*": {
             "origins": [
                 "https://tuinue-wasichana-lzf6l5q99-josemirungus-projects.vercel.app",
                 "https://tuinue-wasichana-rosy.vercel.app",
                 "http://localhost:3000"
             ],
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"],
             "supports_credentials": True
         }})

    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', 
                           'https://tuinue-wasichana-lzf6l5q99-josemirungus-projects.vercel.app')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response

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