from flask import Blueprint, request, jsonify
from app import db
from app.models.donation import Donation
import requests
import os

paypal_bp = Blueprint('paypal', __name__)

PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_SECRET = os.getenv("PAYPAL_SECRET")
PAYPAL_API_BASE = "https://api-m.sandbox.paypal.com"  # Use sandbox for testing

def get_paypal_access_token():
    """Retrieve PayPal access token."""
    auth = (PAYPAL_CLIENT_ID, PAYPAL_SECRET)
    response = requests.post(
        f"{PAYPAL_API_BASE}/v1/oauth2/token",
        data={"grant_type": "client_credentials"},
        auth=auth,
    )
    if response.status_code == 200:
        return response.json()["access_token"]
    return None

@paypal_bp.route('/create-order', methods=['POST'])
def create_order():
    """Creates a PayPal order and returns the approval link."""
    data = request.json
    amount = data.get('amount')
    currency = data.get('currency', 'USD')

    if not amount:
        return jsonify({'error': 'Amount is required'}), 400

    access_token = get_paypal_access_token()
    if not access_token:
        return jsonify({'error': 'Failed to authenticate with PayPal'}), 500

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }

    order_payload = {
        "intent": "CAPTURE",
        "purchase_units": [{
            "amount": {
                "currency_code": currency,
                "value": str(amount)
            }
        }]
    }

    response = requests.post(f"{PAYPAL_API_BASE}/v2/checkout/orders", json=order_payload, headers=headers)

    if response.status_code == 201:
        order_data = response.json()
        return jsonify({'orderID': order_data["id"], 'links': order_data["links"]})
    
    return jsonify({'error': 'Failed to create PayPal order'}), 500

@paypal_bp.route('/capture', methods=['POST'])
def capture_payment():
    """Captures a PayPal payment and updates donation status in DB."""
    data = request.json
    order_id = data.get('order_id')  # Order ID from PayPal
    donation_id = data.get('donation_id')  # Donation in our DB

    if not order_id or not donation_id:
        return jsonify({'error': 'Missing required fields'}), 400

    access_token = get_paypal_access_token()
    if not access_token:
        return jsonify({'error': 'Failed to authenticate with PayPal'}), 500

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }

    # Capture the PayPal payment
    response = requests.post(f"{PAYPAL_API_BASE}/v2/checkout/orders/{order_id}/capture", headers=headers)

    if response.status_code != 201:
        return jsonify({'error': 'Failed to capture payment'}), response.status_code

    capture_data = response.json()
    transaction_id = capture_data["purchase_units"][0]["payments"]["captures"][0]["id"]

    # Find the donation in our database
    donation = Donation.query.get(donation_id)
    if not donation:
        return jsonify({'error': 'Donation not found'}), 404

    # Update donation in database
    donation.transaction_id = transaction_id
    donation.payment_status = 'completed'
    db.session.commit()

    return jsonify({
        'message': 'Payment captured successfully',
        'transaction_id': transaction_id,
        'donation': donation.to_dict()
    })
