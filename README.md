# Tuinue Wasichana

A platform for managing donations to support girls' education and access to essential supplies.

## Project Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- PostgreSQL
- SendGrid account (for emails)
- Stripe account (for payments)
- Cloudinary account (for image uploads)

### Backend Setup
```bash
# Create and activate virtual environment
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials and API keys

# Initialize database
createdb tuinue_wasichana  # If using PostgreSQL
flask db upgrade

# Run development server
flask run
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Run development server
npm start
```

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## Project Structure
```
tuinue-wasichana/
├── backend/           # Flask backend
│   ├── app/          # Application code
│   │   ├── models/   # Database models
│   │   ├── routes/   # API routes
│   │   ├── services/ # External services
│   │   └── utils/    # Utilities
│   ├── tests/        # Backend tests
│   └── config.py     # Configuration
└── frontend/         # React frontend
    ├── public/       # Static files
    ├── src/          # Source code
    │   ├── components/
    │   ├── pages/
    │   └── utils/
    └── tests/        # Frontend tests
```

## Features
- User authentication (donors, charities, admin)
- Donation processing with Stripe
- Recurring donations
- Beneficiary management
- Impact story sharing
- Email notifications
- Admin dashboard
- Charity verification system

## API Documentation
The API documentation is available at `/api/docs` when running the backend server.

### presentation slides - https://www.canva.com/design/DAGe5k1rl-M/974ABTCb93LO6efQkPvo2A/edit?utm_content=DAGe5k1rl-M&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton
### Frontend link - https://tuinue-wasichana-j25zb6jip-josemirungus-projects.vercel.app/


## Contributing
1. Fork the repository
2. Create a new branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License
MIT License
