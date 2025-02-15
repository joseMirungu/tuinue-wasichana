# from flask import Blueprint, request, jsonify
# from flask_jwt_extended import create_access_token
# from app.models.user import User
# from app import db

# auth_bp = Blueprint('auth', __name__)  # Define Blueprint

# @auth_bp.route('/register', methods=['POST'])
# def register():
#     data = request.get_json()
#     if not data or not all(key in data for key in ['email', 'password', 'user_type']):
#         return jsonify({'error': 'Missing required fields'}), 400

#     if User.query.filter_by(email=data['email']).first():
#         return jsonify({'error': 'Email already exists'}), 400

#     # FIX: Removed 'password' from User(...) initialization
#     new_user = User(email=data['email'], user_type=data['user_type'])
    
#     # Set hashed password using the correct method
#     new_user.set_password(data['password'])

#     # db.session.add(new_user)
#     db.session.commit()

#     return jsonify({'message': 'User registered successfully', 'user': new_user.to_dict()}), 201

# @auth_bp.route('/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     user = User.query.filter_by(email=data.get('email')).first()

#     if not user or not user.check_password(data.get('password')):  # Validate password
#         return jsonify({'error': 'Invalid credentials'}), 401

#     access_token = create_access_token(identity=user.id)
#     return jsonify({'access_token': access_token, 'user_type': user.user_type}), 200
