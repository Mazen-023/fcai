# FCAI Learning Platform API Documentation

This API provides endpoints for managing accounts, courses, and projects for an online learning platform.

---

## Project Structure

This project follows the standard Django REST Framework (DRF) architecture. The codebase is organized into multiple Django apps. Each app contains:

- **models.py**: Defines the database schema using Django models.
- **serializers.py**: Translates model instances to and from JSON representations.
- **urls.py**: Maps endpoints to their corresponding views.
- **views.py**: Implements API logic using DRF views or viewsets.
- **tests.py**: Contains unit tests for the app's functionality.

---

## Endpoints Overview

### Accounts
- `POST /accounts/register/` — Register a new user
- `POST /accounts/login/` — Login
- `POST /accounts/logout/` — Logout
- `GET /accounts/profile/` — Get current user profile

### Courses
- `GET /courses/` — List all courses
- `POST /courses/` — Create a new course
- `GET /courses/<id>/` — Get course detail
- `PUT /courses/<id>/` — Update course
- `DELETE /courses/<id>/` — Delete course

#### Modules
- `GET /courses/modules/` — List modules
- `POST /courses/modules/` — Create module
- `GET /courses/modules/<id>/` — Module detail

#### Content
- `GET /courses/contents/` — List content
- `POST /courses/contents/` — Create content
- `GET /courses/contents/<id>/` — Content detail

#### Enrollments
- `GET /courses/enrollments/` — List enrollments
- `POST /courses/enrollments/` — Enroll in a course
- `GET /courses/enrollments/<id>/` — Enrollment detail

---

## Notes
- All endpoints return JSON.
- For full details, see the urls and serializers in each app.

---
### Example Response for Listing Courses
`GET /courses/courses`

```json
{
    "courses": [
        {
            "id": 1,
            "title": "CS50's Introduction to Computer Science",
            "description": "This is CS50, Harvard University’s introduction to the intellectual enterprises of computer science and the art of programming, for concentrators and non-concentrators alike, with or without prior programming experience.",
            "imgURL": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg72cAl3BNikUaU3UB8XhRa-f3sLyqzZLdMHfu4DY2epS5RnjhSCqiXPWavlYzgnj0ou0&usqp=CAU",
            "price": "0.00",
            "university": "Harvard",
            "duration": "12 weeks",
            "archived": false,
            "gated": false,
            "created_at": "2025-07-31T02:35:17.246021Z",
            "updated_at": "2025-07-31T03:04:41.528361Z",
            "instructor": 1
        },
    ]
}
```