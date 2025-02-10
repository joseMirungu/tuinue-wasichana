from flask import Flask, jsonify, request
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
    
    # Configure CORS
    app.config['CORS_HEADERS'] = 'Content-Type'
    CORS(app, 
         resources={r"/*": {
             "origins": [
                 "https://tuinue-wasichana-ql7ta417k-josemirungus-projects.vercel.app",
                 "http://localhost:3000"
             ],
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"],
             "expose_headers": ["Content-Type"],
             "supports_credentials": True
         }})

    @app.errorhandler(Exception)
    def handle_error(error):
        print(f"Error: {str(error)}")
        return jsonify({"error": str(error)}), 500

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