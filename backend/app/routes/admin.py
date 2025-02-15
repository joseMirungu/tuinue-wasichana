from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.charity import Charity
from app.models.donation import Donation
from app import db

# Fix: Ensure Blueprint is named admin_bp instead of just bp
admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

def is_admin():
    """Check if the current user is an admin."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return user and user.user_type == 'admin'

@admin_bp.before_request
@jwt_required()
def verify_admin():
    """Ensure that only admins can access these routes."""
    if not is_admin():
        return jsonify({'error': 'Admin access required'}), 403

@admin_bp.route('/stats', methods=['GET'])
def get_stats():
    """Retrieve statistics on charities, donations, and users."""
    total_charities = Charity.query.count()
    total_donations = db.session.query(db.func.sum(Donation.amount)).scalar() or 0
    total_users = User.query.filter_by(user_type='donor').count()

    return jsonify({
        'total_charities': total_charities,
        'total_donations': float(total_donations),
        'total_users': total_users
    })

@admin_bp.route('/charity-applications', methods=['GET'])
def get_charity_applications():
    """Fetch pending charity applications."""
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

@admin_bp.route('/charity-applications/<int:charity_id>/approve', methods=['POST'])
def approve_charity(charity_id):
    """Approve a pending charity application."""
    charity = Charity.query.get_or_404(charity_id)
    charity.status = 'approved'
    db.session.commit()
    return jsonify({'message': 'Charity approved successfully'})

@admin_bp.route('/charity-applications/<int:charity_id>/reject', methods=['POST'])
def reject_charity(charity_id):
    """Reject a pending charity application."""
    charity = Charity.query.get_or_404(charity_id)
    charity.status = 'rejected'
    db.session.commit()
    return jsonify({'message': 'Charity rejected'})

@admin_bp.route('/users', methods=['GET'])
def get_users():
    """Fetch users, optionally filtering by type."""
    user_type = request.args.get('type')
    query = User.query
    if user_type:
        query = query.filter_by(user_type=user_type)
    users = query.all()
    return jsonify([user.to_dict() for user in users])

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """Update user details (e.g., verification status)."""
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    if 'is_verified' in data:
        user.is_verified = data['is_verified']
    
    db.session.commit()
    return jsonify({'message': 'User updated successfully'})

@admin_bp.route('/charities/<int:charity_id>', methods=['DELETE'])
def delete_charity(charity_id):
    """Delete a charity from the database."""
    charity = Charity.query.get_or_404(charity_id)
    db.session.delete(charity)
    db.session.commit()
    return jsonify({'message': 'Charity deleted successfully'})
