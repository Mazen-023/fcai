# FCAI-Learn

A modern Learning Management System (LMS) designed to streamline course management, student enrollment, and content delivery. Built with Django REST Framework for the backend, React.js for the frontend, and PostgreSQL for data storage, this project enables educators and learners to interact efficiently in a robust, scalable environment.

## 🚀 Tech Stack

- **Backend**: Django REST Framework (DRF)
- **Frontend**: React.js
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Testing**: Django Test Framework & Jest/React Testing Library

## 📋 Prerequisites

- Docker and Docker Compose
- Git
- Node.js (for local development)
- Python 3.11+ (for local development)

## 🛠️ Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mazen-023/fcai
   cd fcai
   ```

2. **Start all services**
   ```bash
   docker compose up -d
   ```

3. **Access the applications**
   - React App: http://localhost:3000
   - Django API: http://localhost:8000
   - Admin Panel: http://localhost:8000/admin

### Local Development

#### Backend Setup
```bash
cd api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

#### Frontend Setup
```bash
cd app
npm install
npm start
```

## 🧪 Running Tests

### Backend Tests
```bash
cd api
python manage.py test
```

### Frontend Tests
```bash
cd app
npm test
```

### Full Test Suite with Docker
```bash
docker-compose exec api python manage.py test
docker-compose exec app npm test -- --watchAll=false
```


## 📁 Project Structure

```
fcai/
├── .github/workflows/     # CI/CD pipelines
├── api/                    # Django backend
│   ├── courses/           # Main app
│   ├── projects/          # Projects app
│   ├── accounts/          # Accounts app
│   ├── fcai/             # Project settings
│   ├── requirements.txt   # Python dependencies
│   ├── Dockerfile        # Backend container
│   └── README.md         # Backend documentation
├── app/                   # React frontend
│   ├── src/              # Source code
│   ├── package.json      # Node dependencies
│   ├── Dockerfile        # Frontend container
│   └── README.md         # Frontend documentation
├── docker-compose.yml     # Multi-container setup
└── README.md             # This file
```
## 📄 Additional Documentation

- [Backend README](api/README.md)

- [Frontend README](app/README.md)