from app import db
from datetime import datetime

class Charity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    registration_number = db.Column(db.String(100))
    contact_email = db.Column(db.String(120))
    contact_phone = db.Column(db.String(20))
    address = db.Column(db.String(200))
    status = db.Column(db.String(20), default='pending')  # pending, approved, rejected
    logo_url = db.Column(db.String(500))  # Cloudinary URL
    website = db.Column(db.String(200))
    social_media = db.Column(db.JSON)  # Store social media links
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    donations = db.relationship('Donation', backref='charity', lazy=True)
    stories = db.relationship('Story', backref='charity', lazy=True)
    beneficiaries = db.relationship('Beneficiary', backref='charity', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'contact_email': self.contact_email,
            'contact_phone': self.contact_phone,
            'status': self.status,
            'logo_url': self.logo_url,
            'website': self.website,
            'social_media': self.social_media
        }

class Beneficiary(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    charity_id = db.Column(db.Integer, db.ForeignKey('charity.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer)
    school = db.Column(db.String(200))
    grade = db.Column(db.String(50))
    location = db.Column(db.String(200))
    story = db.Column(db.Text)
    needs_assessment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    supplies = db.relationship('Supply', backref='beneficiary', lazy=True)

class Supply(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    beneficiary_id = db.Column(db.Integer, db.ForeignKey('beneficiary.id'), nullable=False)
    item_type = db.Column(db.String(100), nullable=False)  # e.g., 'sanitary_pads', 'toiletries'
    quantity = db.Column(db.Integer, nullable=False)
    distribution_date = db.Column(db.DateTime, nullable=False)
    notes = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')  # pending, distributed
    distributed_by = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)