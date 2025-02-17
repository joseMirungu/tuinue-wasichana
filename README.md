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

![stories](https://github.com/user-attachments/assets/a2d3f0bd-4c71-47c9-bb36-9fa968364d2e)

![landing pg](https://github.com/user-attachments/assets/cef84475-e373-46bc-b5e8-c16e1dc038f4)

![causes](https://github.com/user-attachments/assets/03f8763d-7827-45d5-b64e-60da66133ed0)

![admin1](https://github.com/user-attachments/assets/87f30973-ff00-44ad-80b9-c03bd363fafc)

![donate](https://github.com/user-attachments/assets/3a8f2b2f-e03c-41a3-9f18-4461f21ecad1)

![forgotpassword](https://github.com/user-attachments/assets/495a6cbc-c318-40ca-baac-aef297d6fdfc)

![aboutpage](https://github.com/user-attachments/assets/a1261acb-cfe5-4997-8558-6bd17628a7b9)

## Contributing
1. Fork the repository
2. Create a new branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License
MIT License
