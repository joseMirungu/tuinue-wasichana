from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from app.models.user import User, Profile
from app import db

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
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
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        phone=data.get('phone')
    )
    
    db.session.add(user)
    db.session.add(profile)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

@bp.route('/login', methods=['POST'])
def login():
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

@bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
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

@bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
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