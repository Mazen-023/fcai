# FCAI-Learn

A Learning Management System (LMS) designed to streamline course management, student enrollment, and content delivery. Built with Django REST Framework for the backend, React.js for the frontend, and PostgreSQL for data storage.

## 🚀 Tech Stack

- **Backend**: Django REST Framework (DRF)
- **Frontend**: React.js
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Testing**: Django Test Framework & React Testing Library

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
python manage.py makemigrations
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

## Distinctiveness and Complexity

This Learning Management System (LMS) is distinctly different from the other projects in CS50 Web. Unlike Project 2 (e-commerce) or Project 4 (social network), it focuses on educational course management with features like instructor-led course creation, and student enrollment. The project is more complex as it integrates a Django REST Framework (DRF) API as the backend for a React.js frontend, utilizing Django models (Course, Module, Enrollment) and JavaScript for dynamic interactions. It follows best practices for testing with GitHub Actions and uses Docker for CI/CD, which are not implemented in the other projects. The application is fully mobile-responsive using Bootstrap.
