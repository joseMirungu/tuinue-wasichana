from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
import os

from config import Config

# Load environment variables from paypal.env
load_dotenv()

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    print("PayPal Client ID:", os.getenv("PAYPAL_CLIENT_ID"))  # Debugging

    
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # CORS configuration to allow both local and deployed frontend
    CORS(app, resources={
        r"/*": {
            "origins": [
                "http://localhost:3000",  # Local frontend
                "https://tuinue-wasichana-j25zb6jip-josemirungus-projects.vercel.app"  # Deployed frontend
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Import and register blueprints
    from app.routes.auth import auth_bp
    from app.routes.admin import admin_bp
    from app.routes.charity import charity_bp
    from app.routes.donor import donor_bp
    from app.routes.paypal_route import paypal_bp  # Added PayPal routes

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(charity_bp, url_prefix='/charity')
    app.register_blueprint(donor_bp, url_prefix='/donor')
    app.register_blueprint(paypal_bp, url_prefix='/paypal')  # Register PayPal routes

    return app
