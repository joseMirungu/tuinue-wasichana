from app import db
from datetime import datetime

class Story(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    charity_id = db.Column(db.Integer, db.ForeignKey('charity.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500))  # Cloudinary URL
    beneficiary_name = db.Column(db.String(100))  # Can be anonymous
    location = db.Column(db.String(200))
    impact_numbers = db.Column(db.Integer)  # Number of beneficiaries impacted
    tags = db.Column(db.JSON)  # Store categories/tags
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_featured = db.Column(db.Boolean, default=False)
    status = db.Column(db.String(20), default='draft')  # draft, published, archived
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'image_url': self.image_url,
            'beneficiary_name': self.beneficiary_name,
            'location': self.location,
            'impact_numbers': self.impact_numbers,
            'tags': self.tags,
            'created_at': self.created_at.isoformat(),
            'is_featured': self.is_featured,
            'status': self.status
        }

class Update(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    story_id = db.Column(db.Integer, db.ForeignKey('story.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    story = db.relationship('Story', backref='updates')