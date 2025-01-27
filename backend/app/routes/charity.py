from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.charity import Charity, Beneficiary, Supply
from app.models.story import Story
from app.models.donation import Donation
from app.services.cloudinary import upload_image
from app import db
from datetime import datetime

bp = Blueprint('charity', __name__, url_prefix='/charity')

def get_charity():
    user_id = get_jwt_identity()
    return Charity.query.filter_by(user_id=user_id).first()

@bp.before_request
@jwt_required()
def verify_charity():
    if not get_charity():
        return jsonify({'error': 'Charity access required'}), 403

@bp.route('/stats', methods=['GET'])
def get_stats():
    charity = get_charity()
    total_donations = Donation.get_total_donations(charity.id)
    beneficiaries_count = Beneficiary.query.filter_by(charity_id=charity.id).count()
    recurring_donors = Donation.query.filter_by(
        charity_id=charity.id, 
        is_recurring=True, 
        payment_status='completed'
    ).distinct(Donation.donor_id).count()

    return jsonify({
        'totalDonations': total_donations,
        'beneficiariesCount': beneficiaries_count,
        'activeRecurringDonors': recurring_donors
    })

@bp.route('/beneficiaries', methods=['GET', 'POST'])
def handle_beneficiaries():
    charity = get_charity()
    
    if request.method == 'POST':
        data = request.get_json()
        beneficiary = Beneficiary(
            charity_id=charity.id,
            name=data['name'],
            age=data['age'],
            school=data['school'],
            grade=data['grade'],
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

@bp.route('/stories', methods=['GET', 'POST'])
def handle_stories():
    charity = get_charity()
    
    if request.method == 'POST':
        form_data = request.form
        image = request.files.get('image')
        
        image_url = None
        if image:
            image_url = upload_image(image)
            
        story = Story(
            charity_id=charity.id,
            title=form_data['title'],
            content=form_data['content'],
            image_url=image_url,
            beneficiary_name=form_data.get('beneficiary_name'),
            impact_numbers=form_data.get('impact_numbers', type=int)
        )
        db.session.add(story)
        db.session.commit()
        return jsonify({'message': 'Story created successfully'}), 201

    stories = Story.query.filter_by(charity_id=charity.id).order_by(Story.created_at.desc()).all()
    return jsonify([story.to_dict() for story in stories])

@bp.route('/supplies', methods=['POST'])
def add_supplies():
    data = request.get_json()
    supply = Supply(
        beneficiary_id=data['beneficiary_id'],
        item_type=data['item_type'],
        quantity=data['quantity'],
        distribution_date=datetime.strptime(data['distribution_date'], '%Y-%m-%d'),
        notes=data.get('notes')
    )
    db.session.add(supply)
    db.session.commit()
    return jsonify({'message': 'Supplies added successfully'}), 201

@bp.route('/profile', methods=['GET', 'PUT'])
def handle_profile():
    charity = get_charity()
    
    if request.method == 'PUT':
        data = request.get_json()
        for field in ['name', 'description', 'contact_email', 'contact_phone', 'website']:
            if field in data:
                setattr(charity, field, data[field])
        db.session.commit()
        return jsonify({'message': 'Profile updated successfully'})
    
    return jsonify(charity.to_dict())