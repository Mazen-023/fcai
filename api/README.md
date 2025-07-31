# FCAI Learning Platform API Documentation

This API provides endpoints for managing users, courses, projects, and enrollments for an online learning platform.

---

## Project Structure

This project follows the standard Django REST Framework (DRF) architecture. The codebase is organized into multiple Django apps, each responsible for a specific domain (e.g., accounts, courses, projects). Each app typically contains:

- **models.py**: Defines the database schema using Django models.
- **serializers.py**: Translates model instances to and from JSON representations.
- **views.py**: Implements API logic using DRF views or viewsets.
- **urls.py**: Maps endpoints to their corresponding views.

This modular structure promotes maintainability and scalability, allowing each app to encapsulate its functionality and API endpoints.

---

## Endpoints Overview

### Accounts
- `POST /accounts/register/` — Register a new user
- `POST /accounts/login/` — Login
- `POST /accounts/logout/` — Logout
- `GET /accounts/profile/` — Get current user profile

### Courses
- `GET /courses/` — List all courses (public)
- `POST /courses/` — Create a new course (authenticated)
- `GET /courses/<id>/` — Get course detail (authenticated)
- `PUT /courses/<id>/` — Update course (owner only)
- `DELETE /courses/<id>/` — Delete course (owner only)

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

#### Assignments
- `GET /projects/assignments/` — List assignments
- `POST /projects/assignments/` — Create assignment
- `GET /projects/assignments/<id>/` — Assignment detail
- `PUT /projects/assignments/<id>/` — Update assignment
- `DELETE /projects/assignments/<id>/` — Delete assignment

### Questions
- `GET /projects/questions/` — List questions
- `POST /projects/questions/` — Create question
- `GET /projects/questions/<id>/` — Question detail

#### Answers
- `GET /projects/answers/` — List answers
- `POST /projects/answers/` — Create answer
- `GET /projects/answers/<id>/` — Answer detail

#### Grades
- `GET /projects/grades/` — List grades
- `POST /projects/grades/` — Create grade
- `GET /projects/grades/<id>/` — Grade detail

---

## Notes
- All endpoints return JSON.
GET /courses/courses/

{
    "courses": [
        {
            "id": 1,
            "title": "CS50's Introduction to Computer Science",
            "description": "This is CS50, Harvard University’s introduction to the intellectual enterprises of computer science and the art of programming, for concentrators and non-concentrators alike, with or without prior programming experience. (Two thirds of CS50 students have never taken CS before.) This course teaches you how to solve problems, both with and without code, with an emphasis on correctness, design, and style. Topics include computational thinking, abstraction, algorithms, data structures, and computer science more generally. Problem sets inspired by the arts, humanities, social sciences, and sciences. More than teach you how to program in one language, this course teaches you how to program fundamentally and how to teach yourself new languages ultimately. The course starts with a traditional but omnipresent language called C that underlies today’s newer languages, via which you’ll learn not only about functions, variables, conditionals, loops, and more, but also about how computers themselves work underneath the hood, memory and all. The course then transitions to Python, a higher-level language that you’ll understand all the more because of C. Toward term’s end, the course introduces SQL, via which you can store data in databases, along with HTML, CSS, and JavaScript, via which you can create web and mobile apps alike. Course culminates in a final project.",
            "imgURL": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg72cAl3BNikUaU3UB8XhRa-f3sLyqzZLdMHfu4DY2epS5RnjhSCqiXPWavlYzgnj0ou0&usqp=CAU",
            "price": "0.00",
            "university": "Harvard",
            "duration": "12 weeks",
            "archived": false,
            "gated": false,
            "created_at": "2025-07-31T02:35:17.246021Z",
            "updated_at": "2025-07-31T03:04:41.528361Z",
            "instructor": 1
        }
    ]
}

- For full details, see the urls and serializers in each app.