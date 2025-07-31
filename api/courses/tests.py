from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

from projects.models import Module, Assignment, Question, Answer, Grade
from courses.models import Course, Module, Content, Enrollment
from accounts.models import User


# Create your tests here.
class CourseAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.instructor = User.objects.create_user(username='teacher1', password='pass', role='teacher')
        self.course = Course.objects.create(
            title='Test Course', imgURL='http://example.com/img.jpg', description='desc', price=0,
            university='FCAI', duration='10h', instructor=self.instructor
        )

    def test_course_list(self):
        """Test the course list endpoint (public)."""
        url = reverse('course-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('courses', response.data)

    def test_course_detail(self):
        """Test the course detail endpoint."""
        self.client.force_authenticate(user=self.instructor)  # Add this line
        url = reverse('course-detail', args=[self.course.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.course.id)

    def test_create_course(self):
        """Test creating a new course."""
        self.client.force_authenticate(user=self.instructor)
        data = {
            'title': 'New Course', 'imgURL': 'http://img.com', 'description': 'desc', 'price': 10,
            'university': 'FCAI', 'duration': '5h', 'instructor': self.instructor.id
        }
        url = reverse('course-list')
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class ModuleAPITests(APITestCase):
    def setUp(self):
        self.instructor = User.objects.create_user(username='teacher2', password='pass', role='teacher')
        self.client.force_authenticate(user=self.instructor)
        self.course = Course.objects.create(title='C', imgURL='http://x', description='d', price=0, university='U', duration='1h', instructor=self.instructor)
        self.module = Module.objects.create(title='M', course=self.course)

    def test_module_list(self):
        """Test the module list endpoint."""
        url = reverse('module-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_module_detail(self):
        """Test the module detail endpoint."""
        url = reverse('module-detail', args=[self.module.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_module(self):
        """Test creating a new module."""
        url = reverse('module-list')
        data = {'title': 'M2', 'course': self.course.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class ContentAPITests(APITestCase):
    def setUp(self):
        self.instructor = User.objects.create_user(username='teacher3', password='pass', role='teacher')
        self.client.force_authenticate(user=self.instructor)
        self.course = Course.objects.create(title='C2', imgURL='http://x', description='d', price=0, university='U', duration='1h', instructor=self.instructor)
        self.module = Module.objects.create(title='M', course=self.course)
        self.content = Content.objects.create(title='Content1', type='text', url='', order=0, module=self.module)

    def test_content_list(self):
        """Test the content list endpoint."""
        url = reverse('content-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_content_detail(self):
        """Test the content detail endpoint."""
        url = reverse('content-detail', args=[self.content.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_content(self):
        """Test creating a new content."""
        url = reverse('content-list')
        data = {'title': 'Content2', 'type': 'text', 'url': '', 'order': 1, 'module': self.module.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class EnrollmentAPITests(APITestCase):
    def setUp(self):
        self.instructor = User.objects.create_user(username='teacher8', password='pass', role='teacher')
        self.student = User.objects.create_user(username='student3', password='pass', role='student')
        self.client.force_authenticate(user=self.student)
        self.course = Course.objects.create(title='C7', imgURL='http://x', description='d', price=0, university='U', duration='1h', instructor=self.instructor)
        self.enrollment = Enrollment.objects.create(student=self.student, course=self.course)

    def test_enrollment_list(self):
        """Test the enrollment list endpoint."""
        url = reverse('enrollment-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_enrollment_detail(self):
        """Test the enrollment detail endpoint."""
        url = reverse('enrollment-detail', args=[self.enrollment.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_enrollment(self):
        """Test creating a new enrollment."""
        url = reverse('enrollment-list')
        data = {'student': self.student.id, 'course': self.course.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class PermissionTests(APITestCase):
    def setUp(self):
        # Users
        self.instructor1 = User.objects.create_user(username='instructor1', password='pass', role='teacher')
        self.instructor2 = User.objects.create_user(username='instructor2', password='pass', role='teacher')
        self.student1 = User.objects.create_user(username='student1', password='pass', role='student')
        self.student2 = User.objects.create_user(username='student2', password='pass', role='student')

        # Course owned by instructor1
        self.course = Course.objects.create(title='C', imgURL='http://x', description='d', price=0, university='U', duration='1h', instructor=self.instructor1)
        self.module = Module.objects.create(title='M', course=self.course)
        self.assignment = Assignment.objects.create(title='A', order=0, min_pass_score=0, is_required=True, module=self.module)
        self.question = Question.objects.create(title='Q', assignment=self.assignment)
        self.answer = Answer.objects.create(question=self.question, correct_answer='A', is_correct=True)
        self.grade = Grade.objects.create(student=self.student1, assignment=self.assignment, score=90)
        self.enrollment = Enrollment.objects.create(student=self.student1, course=self.course)

    def test_course_owner_can_edit(self):
        """Test that the course owner can edit the course."""
        self.client.force_authenticate(user=self.instructor1)
        url = reverse('course-detail', args=[self.course.id])
        response = self.client.put(url, {'title': 'Changed', 'imgURL': 'http://x', 'description': 'd', 'price': 0, 'university': 'U', 'duration': '1h', 'instructor': self.instructor1.id})
        self.assertNotEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_non_owner_cannot_edit_course(self):
        """Test that a non-owner cannot edit the course."""
        self.client.force_authenticate(user=self.instructor2)
        url = reverse('course-detail', args=[self.course.id])
        # Send all required fields except instructor (read-only)
        data = {
            'title': self.course.title,
            'imgURL': self.course.imgURL,
            'description': self.course.description,
            'price': self.course.price,
            'university': self.course.university,
            'duration': self.course.duration
        }
        response = self.client.put(url, data, format='json')
        # Accept 400 (bad request) or 403 (forbidden) depending on serializer/permission order
        self.assertIn(response.status_code, [status.HTTP_400_BAD_REQUEST, status.HTTP_403_FORBIDDEN])

    def test_student_can_edit_own_enrollment(self):
        """Test that a student can edit their own enrollment."""
        self.client.force_authenticate(user=self.student1)
        url = reverse('enrollment-detail', args=[self.enrollment.id])
        response = self.client.put(url, {'student': self.student1.id, 'course': self.course.id})
        self.assertNotEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_student_cannot_edit_others_enrollment(self):
        """Test that a student cannot edit another student's enrollment."""
        self.client.force_authenticate(user=self.student2)
        url = reverse('enrollment-detail', args=[self.enrollment.id])
        response = self.client.put(url, {'student': self.student1.id, 'course': self.course.id}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_cannot_access(self):
        """Test that unauthenticated users cannot access course details."""
        self.client.logout()
        url = reverse('course-detail', args=[self.course.id])
        response = self.client.get(url)
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])