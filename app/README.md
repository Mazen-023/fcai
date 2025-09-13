# FCAI Learning Platform Frontend Documentation

This React application provides the user interface for the FCAI Learning Platform, allowing students and instructors to interact with courses, modules, and learning materials.

---

## Project Structure

The frontend is built with React and follows a component-based architecture:

```
app/
├── public/            # Static files
├── src/               # Source code
│   ├── components/    # Reusable UI components
│   ├── contexts/      # React context providers
│   ├── pages/         # Page components
│   └── routes/        # Routing configuration
```

---

## Routes Overview

### Authentication
- `/register` — Create a new account
- `/login` — Log into the system
- `/profile` — View and manage user profile

### Courses
- `/` — Home page with featured courses
- `/courses` — Browse all available courses
- `/courses/:courseId` — View course details and modules
- `/courses/create` — Create a new course (instructors only)
- `/courses/:courseId/edit` — Edit course information and modules (instructors only)

---

## Key Components

### Authentication
- `AuthContext.jsx` — Manages authentication state
- `ProtectedRoute.jsx` — Guards routes that require authentication

### Course Management
- `CourseList.jsx` — Displays course catalog
- `CourseDetail.jsx` — Shows detailed course information
- `CourseModulesForm.jsx` — Interface for managing modules
- `ModuleManager.jsx` — CRUD operations for course modules

### User Interface
- `InstructorCourses.jsx` — Displays instructor's created courses
- `CourseEnrollments.jsx` — Handles student enrollment functionality

---

## User Roles

### Students
- Browse and enroll in courses
- View course modules

### Instructors
- Create and manage courses
- Add and organize course modules

---

## Responsive Design

The application is fully responsive using:
- Bootstrap 5 grid system and components

---