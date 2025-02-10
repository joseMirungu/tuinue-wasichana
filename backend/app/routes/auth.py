from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from flask_cors import cross_origin
from app.models.user import User, Profile
from app import db

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register', methods=['POST', 'OPTIONS'])
@cross_origin(origins=['https://tuinue-wasichana-5kvpfbxdc-josemirungus-projects.vercel.app',
                      'https://tuinue-wasichana-rosy.vercel.app',
                      'http://localhost:3000'],
             methods=['POST', 'OPTIONS'],
             allow_headers=['Content-Type', 'Accept'])
def register():
    if request.method == 'OPTIONS':
        return jsonify({"message": "OK"}), 200
    
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(k in data for k in ['email', 'password', 'user_type']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400
            
        user = User(
            email=data['email'],
            user_type=data['user_type']
        )
        user.set_password(data['password'])
        
        # Create user profile
        profile = Profile(
            user=user,
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            phone=data.get('phone', '')
        )
        
        db.session.add(user)
        db.session.add(profile)
        db.session.commit()
        
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Registration error: {str(e)}")
        return jsonify({'error': 'Registration failed'}), 500

@bp.route('/login', methods=['POST', 'OPTIONS'])
@cross_origin(origins=['https://tuinue-wasichana-5kvpfbxdc-josemirungus-projects.vercel.app',
                      'https://tuinue-wasichana-rosy.vercel.app',
                      'http://localhost:3000'],
             methods=['POST', 'OPTIONS'],
             allow_headers=['Content-Type', 'Accept'])
def login():
    if request.method == 'OPTIONS':
        return jsonify({"message": "OK"}), 200
        
    try:
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        access_token = create_access_token(identity=user.id)
        return jsonify({
            'token': access_token,
            'user_type': user.user_type,
            'user': user.to_dict()
        }), 200
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': 'Login failed'}), 500

@bp.route('/profile', methods=['GET'])
@jwt_required()
@cross_origin(origins=['https://tuinue-wasichana-5kvpfbxdc-josemirungus-projects.vercel.app',
                      'https://tuinue-wasichana-rosy.vercel.app',
                      'http://localhost:3000'])
def get_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id)
        profile = user.profile
        
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
            
        return jsonify({
            'user': user.to_dict(),
            'profile': {
                'first_name': profile.first_name,
                'last_name': profile.last_name,
                'phone': profile.phone,
                'address': profile.address,
                'city': profile.city,
                'country': profile.country,
                'bio': profile.bio,
                'profile_picture': profile.profile_picture
            }
        })
    except Exception as e:
        print(f"Profile fetch error: {str(e)}")
        return jsonify({'error': 'Failed to fetch profile'}), 500

@bp.route('/profile', methods=['PUT'])
@jwt_required()
@cross_origin(origins=['https://tuinue-wasichana-5kvpfbxdc-josemirungus-projects.vercel.app',
                      'https://tuinue-wasichana-rosy.vercel.app',
                      'http://localhost:3000'])
def update_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id)
        profile = user.profile
        data = request.get_json()
        
        if not profile:
            profile = Profile(user=user)
            db.session.add(profile)
        
        for field in ['first_name', 'last_name', 'phone', 'address', 'city', 'country', 'bio']:
            if field in data:
                setattr(profile, field, data[field])
        
        db.session.commit()
        return jsonify({'message': 'Profile updated successfully'})
    except Exception as e:
        db.session.rollback()
        print(f"Profile update error: {str(e)}")
        return jsonify({'error': 'Failed to update profile'}), 500