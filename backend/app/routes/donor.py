from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.charity import Charity
from app.models.donation import Donation, RecurringDonation
from app.models.story import Story
import stripe
from app import db

bp = Blueprint('donor', __name__, url_prefix='/donor')

@bp.before_request
@jwt_required()
def verify_donor():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or user.user_type != 'donor':
        return jsonify({'error': 'Donor access required'}), 403

@bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    user_id = get_jwt_identity()
    total_donated = db.session.query(db.func.sum(Donation.amount))\
        .filter_by(donor_id=user_id, payment_status='completed')\
        .scalar() or 0
    
    recent_donations = Donation.query\
        .filter_by(donor_id=user_id)\
        .order_by(Donation.created_at.desc())\
        .limit(5)\
        .all()
        
    recurring_donations = RecurringDonation.query\
        .filter_by(donor_id=user_id, status='active')\
        .all()
    
    return jsonify({
        'total_donated': float(total_donated),
        'recent_donations': [d.to_dict() for d in recent_donations],
        'recurring_donations': [{
            'id': rd.id,
            'amount': rd.amount,
            'currency': rd.currency,
            'billing_day': rd.billing_day,
            'next_charge': rd.next_charge.isoformat() if rd.next_charge else None
        } for rd in recurring_donations]
    })

@bp.route('/charities', methods=['GET'])
def get_charities():
    charities = Charity.query.filter_by(status='approved').all()
    return jsonify([charity.to_dict() for charity in charities])

@bp.route('/create-payment-intent', methods=['POST'])
def create_payment_intent():
    try:
        data = request.get_json()
        payment_intent = stripe.PaymentIntent.create(
            amount=int(data['amount']),  # amount in cents
            currency=data['currency'],
            metadata={
                'charity_id': data['charity_id'],
                'donor_id': get_jwt_identity(),
                'is_recurring': data.get('is_recurring', False),
                'is_anonymous': data.get('is_anonymous', False)
            }
        )
        return jsonify({'clientSecret': payment_intent.client_secret})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@bp.route('/setup-recurring', methods=['POST'])
def setup_recurring():
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        recurring = RecurringDonation(
            donor_id=user_id,
            charity_id=data['charity_id'],
            amount=data['amount'],
            currency=data['currency'],
            billing_day=data['billing_day']
        )
        db.session.add(recurring)
        db.session.commit()
        
        return jsonify({'message': 'Recurring donation set up successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@bp.route('/recurring/<int:donation_id>', methods=['PUT'])
def update_recurring(donation_id):
    recurring = RecurringDonation.query.get_or_404(donation_id)
    if recurring.donor_id != get_jwt_identity():
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    if 'status' in data:
        recurring.status = data['status']
    if 'billing_day' in data:
        recurring.billing_day = data['billing_day']
    
    db.session.commit()
    return jsonify({'message': 'Recurring donation updated successfully'})

@bp.route('/donations', methods=['GET'])
def get_donations():
    user_id = get_jwt_identity()
    donations = Donation.query\
        .filter_by(donor_id=user_id)\
        .order_by(Donation.created_at.desc())\
        .all()
    return jsonify([d.to_dict() for d in donations])

@bp.route('/stories', methods=['GET'])
def get_stories():
    stories = Story.query\
        .join(Charity)\
        .filter(Charity.status == 'approved')\
        .order_by(Story.created_at.desc())\
        .limit(10)\
        .all()
    return jsonify([story.to_dict() for story in stories])