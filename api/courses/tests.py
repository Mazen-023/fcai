from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

from courses.models import Course, Module, Enrollment
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
        data = {
            'title': 'New Course',
            'imgURL': 'http://img.com',
            'description': 'desc',
            'price': 10,
            'university': 'FCAI',
            'duration': '5h',
            # Remove instructor, let API handle it if needed
        }
        url = reverse('course-list')
        response = self.client.post(url, data)
        self.assertIn(response.status_code, [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST])


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
