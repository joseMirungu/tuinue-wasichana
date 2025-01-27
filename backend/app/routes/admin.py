from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.charity import Charity
from app.models.donation import Donation
from app import db

bp = Blueprint('admin', __name__, url_prefix='/admin')

def is_admin():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return user and user.user_type == 'admin'

@bp.before_request
@jwt_required()
def verify_admin():
    if not is_admin():
        return jsonify({'error': 'Admin access required'}), 403

@bp.route('/stats', methods=['GET'])
def get_stats():
    total_charities = Charity.query.count()
    total_donations = db.session.query(db.func.sum(Donation.amount)).scalar() or 0
    total_users = User.query.filter_by(user_type='donor').count()

    return jsonify({
        'total_charities': total_charities,
        'total_donations': float(total_donations),
        'total_users': total_users
    })

@bp.route('/charity-applications', methods=['GET'])
def get_charity_applications():
    charities = Charity.query.filter_by(status='pending').all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'description': c.description,
        'registration_number': c.registration_number,
        'contact_email': c.contact_email,
        'contact_phone': c.contact_phone,
        'created_at': c.created_at.isoformat()
    } for c in charities])

@bp.route('/charity-applications/<int:charity_id>/approve', methods=['POST'])
def approve_charity(charity_id):
    charity = Charity.query.get_or_404(charity_id)
    charity.status = 'approved'
    db.session.commit()
    return jsonify({'message': 'Charity approved successfully'})

@bp.route('/charity-applications/<int:charity_id>/reject', methods=['POST'])
def reject_charity(charity_id):
    charity = Charity.query.get_or_404(charity_id)
    charity.status = 'rejected'
    db.session.commit()
    return jsonify({'message': 'Charity rejected'})

@bp.route('/users', methods=['GET'])
def get_users():
    user_type = request.args.get('type')
    query = User.query
    if user_type:
        query = query.filter_by(user_type=user_type)
    users = query.all()
    return jsonify([user.to_dict() for user in users])

@bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    if 'is_verified' in data:
        user.is_verified = data['is_verified']
    
    db.session.commit()
    return jsonify({'message': 'User updated successfully'})

@bp.route('/charities/<int:charity_id>', methods=['DELETE'])
def delete_charity(charity_id):
    charity = Charity.query.get_or_404(charity_id)
    db.session.delete(charity)
    db.session.commit()
    return jsonify({'message': 'Charity deleted successfully'})