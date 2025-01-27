from app import db
from datetime import datetime

class Donation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    donor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    charity_id = db.Column(db.Integer, db.ForeignKey('charity.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), default='USD')
    is_anonymous = db.Column(db.Boolean, default=False)
    is_recurring = db.Column(db.Boolean, default=False)
    recurring_day = db.Column(db.Integer)  # Day of month for recurring donations
    payment_status = db.Column(db.String(20), default='pending')  # pending, completed, failed
    payment_method = db.Column(db.String(50))  # paypal, stripe, etc.
    stripe_payment_intent = db.Column(db.String(200))
    transaction_id = db.Column(db.String(200))
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'amount': self.amount,
            'currency': self.currency,
            'is_anonymous': self.is_anonymous,
            'is_recurring': self.is_recurring,
            'recurring_day': self.recurring_day,
            'payment_status': self.payment_status,
            'payment_method': self.payment_method,
            'created_at': self.created_at.isoformat()
        }
    
    @staticmethod
    def get_total_donations(charity_id):
        return db.session.query(db.func.sum(Donation.amount))\
            .filter_by(charity_id=charity_id, payment_status='completed')\
            .scalar() or 0.0
    
    @staticmethod
    def get_monthly_donations(charity_id, year, month):
        return db.session.query(db.func.sum(Donation.amount))\
            .filter_by(charity_id=charity_id, payment_status='completed')\
            .filter(db.extract('year', Donation.created_at) == year)\
            .filter(db.extract('month', Donation.created_at) == month)\
            .scalar() or 0.0

class RecurringDonation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    donor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    charity_id = db.Column(db.Integer, db.ForeignKey('charity.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), default='USD')
    status = db.Column(db.String(20), default='active')  # active, paused, cancelled
    billing_day = db.Column(db.Integer, nullable=False)  # Day of month
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime)  # Null means indefinite
    last_charged = db.Column(db.DateTime)
    next_charge = db.Column(db.DateTime)
    stripe_subscription_id = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)