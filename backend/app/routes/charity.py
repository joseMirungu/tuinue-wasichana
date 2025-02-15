from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.charity import Charity, Beneficiary, Supply
from app.models.story import Story
from app.models.donation import Donation
from app.services.cloudinary import upload_image
from app import db
from datetime import datetime

charity_bp = Blueprint('charity', __name__, url_prefix='/charity')

def get_charity():
    """Retrieve the current user's charity account."""
    user_id = get_jwt_identity()
    return Charity.query.filter_by(user_id=user_id).first()

@charity_bp.before_request
@jwt_required()
def verify_charity():
    """Ensure only charities can access these routes."""
    if not get_charity():
        return jsonify({'error': 'Unauthorized: Charity access required'}), 401

@charity_bp.route('/stats', methods=['GET'])
def get_stats():
    """Get charity statistics."""
    charity = get_charity()
    if not charity:
        return jsonify({'error': 'Charity not found'}), 404

    total_donations = Donation.get_total_donations(charity.id)
    beneficiaries_count = Beneficiary.query.filter_by(charity_id=charity.id).count()
    recurring_donors = (
        db.session.query(Donation.donor_id)
        .filter_by(charity_id=charity.id, is_recurring=True, payment_status='completed')
        .distinct()
        .count()
    )

    return jsonify({
        'totalDonations': total_donations,
        'beneficiariesCount': beneficiaries_count,
        'activeRecurringDonors': recurring_donors
    })

@charity_bp.route('/beneficiaries', methods=['GET', 'POST'])
def handle_beneficiaries():
    """Handle beneficiaries: GET all, POST a new one."""
    charity = get_charity()
    if not charity:
        return jsonify({'error': 'Charity not found'}), 404

    if request.method == 'POST':
        data = request.get_json()
        beneficiary = Beneficiary(
            charity_id=charity.id,
            name=data.get('name'),
            age=data.get('age'),
            school=data.get('school'),
            grade=data.get('grade'),
            location=data.get('location'),
            story=data.get('story')
        )
        db.session.add(beneficiary)
        db.session.commit()
        return jsonify({'message': 'Beneficiary added successfully'}), 201

    beneficiaries = Beneficiary.query.filter_by(charity_id=charity.id).all()
    return jsonify([{
        'id': b.id,
        'name': b.name,
        'age': b.age,
        'school': b.school,
        'grade': b.grade,
        'location': b.location
    } for b in beneficiaries])

@charity_bp.route('/stories', methods=['GET', 'POST'])
def handle_stories():
    """Handle charity stories: GET all, POST a new one."""
    charity = get_charity()
    if not charity:
        return jsonify({'error': 'Charity not found'}), 404

    if request.method == 'POST':
        form_data = request.form
        image = request.files.get('image')
        
        image_url = None
        if image:
            try:
                image_url = upload_image(image)
            except Exception as e:
                return jsonify({'error': 'Image upload failed', 'details': str(e)}), 400
            
        story = Story(
            charity_id=charity.id,
            title=form_data.get('title'),
            content=form_data.get('content'),
            image_url=image_url,
            beneficiary_name=form_data.get('beneficiary_name'),
            impact_numbers=int(form_data.get('impact_numbers', 0))  # Fix integer conversion
        )
        db.session.add(story)
        db.session.commit()
        return jsonify({'message': 'Story created successfully'}), 201

    stories = Story.query.filter_by(charity_id=charity.id).order_by(Story.created_at.desc()).all()
    return jsonify([story.to_dict() for story in stories])

@charity_bp.route('/supplies', methods=['POST'])
def add_supplies():
    """Add supplies to beneficiaries."""
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid request'}), 400

    supply = Supply(
        beneficiary_id=data.get('beneficiary_id'),
        item_type=data.get('item_type'),
        quantity=data.get('quantity'),
        distribution_date=datetime.strptime(data.get('distribution_date', ''), '%Y-%m-%d'),
        notes=data.get('notes')
    )
    db.session.add(supply)
    db.session.commit()
    return jsonify({'message': 'Supplies added successfully'}), 201

@charity_bp.route('/profile', methods=['GET', 'PUT'])
def handle_profile():
    """View and update charity profile."""
    charity = get_charity()
    if not charity:
        return jsonify({'error': 'Charity not found'}), 404

    if request.method == 'PUT':
        data = request.get_json()
        for field in ['name', 'description', 'contact_email', 'contact_phone', 'website']:
            if field in data:
                setattr(charity, field, data[field])
        db.session.commit()
        return jsonify({'message': 'Profile updated successfully'})
    
    return jsonify(charity.to_dict())
