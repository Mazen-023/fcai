from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

from projects.models import Module, Assignment, Question, Answer, Grade
from courses.models import Course, Module
from accounts.models import User


# Create your tests here.
class AssignmentAPITests(APITestCase):
    def setUp(self):
        self.instructor = User.objects.create_user(username='teacher4', password='pass', role='teacher')
        self.client.force_authenticate(user=self.instructor)
        self.course = Course.objects.create(title='C3', imgURL='http://x', description='d', price=0, university='U', duration='1h', instructor=self.instructor)
        self.module = Module.objects.create(title='M', course=self.course)
        self.assignment = Assignment.objects.create(title='A1', order=0, min_pass_score=0, is_required=True, module=self.module)

    def test_assignment_list(self):
        """Test the assignment list endpoint."""
        url = reverse('assignment-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_assignment_detail(self):
        """Test the assignment detail endpoint."""
        url = reverse('assignment-detail', args=[self.assignment.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_assignment(self):
        """Test creating a new assignment."""
        url = reverse('assignment-list')
        data = {'title': 'A2', 'order': 1, 'min_pass_score': 0, 'is_required': True, 'module': self.module.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class QuestionAPITests(APITestCase):
    def setUp(self):
        self.instructor = User.objects.create_user(username='teacher5', password='pass', role='teacher')
        self.client.force_authenticate(user=self.instructor)
        self.course = Course.objects.create(title='C4', imgURL='http://x', description='d', price=0, university='U', duration='1h', instructor=self.instructor)
        self.module = Module.objects.create(title='M', course=self.course)
        self.assignment = Assignment.objects.create(title='A1', order=0, min_pass_score=0, is_required=True, module=self.module)
        self.question = Question.objects.create(title='Q1?', assignment=self.assignment)

    def test_question_list(self):
        """Test the question list endpoint."""
        url = reverse('question-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_question_detail(self):
        """Test the question detail endpoint."""
        url = reverse('question-detail', args=[self.question.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_question(self):
        """Test creating a new question."""
        url = reverse('question-list')
        data = {'assignment': self.assignment.id, 'title': 'Q2?'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class AnswerAPITests(APITestCase):
    def setUp(self):
        self.instructor = User.objects.create_user(username='teacher6', password='pass', role='teacher')
        self.client.force_authenticate(user=self.instructor)
        self.course = Course.objects.create(title='C5', imgURL='http://x', description='d', price=0, university='U', duration='1h', instructor=self.instructor)
        self.module = Module.objects.create(title='M', course=self.course)
        self.assignment = Assignment.objects.create(title='A1', order=0, min_pass_score=0, is_required=True, module=self.module)
        self.question = Question.objects.create(title='Q1?', assignment=self.assignment)
        self.answer = Answer.objects.create(question=self.question, is_correct=True, correct_answer='A')

    def test_answer_list(self):
        """Test the answer list endpoint."""
        url = reverse('answer-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_answer_detail(self):
        """Test the answer detail endpoint."""
        url = reverse('answer-detail', args=[self.answer.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_answer(self):
        """Test creating a new answer."""
        url = reverse('answer-list')
        data = {'question': self.question.id, 'is_correct': False, 'correct_answer': 'A2'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class GradeAPITests(APITestCase):
    def setUp(self):
        self.instructor = User.objects.create_user(username='teacher7', password='pass', role='teacher')
        self.student = User.objects.create_user(username='student2', password='pass', role='student')
        self.client.force_authenticate(user=self.student)
        self.course = Course.objects.create(title='C6', imgURL='http://x', description='d', price=0, university='U', duration='1h', instructor=self.instructor)
        self.module = Module.objects.create(title='M', course=self.course)
        self.assignment = Assignment.objects.create(title='A1', order=0, min_pass_score=0, is_required=True, module=self.module)
        # Do not pre-create a grade for this student/assignment, so test_create_grade can succeed

    def create_grade(self):
        self.grade = Grade.objects.create(student=self.student, assignment=self.assignment, score=95)

    def test_grade_list(self):
        """Test the grade list endpoint."""
        url = reverse('grade-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_grade_detail(self):
        """Test the grade detail endpoint."""
        self.create_grade()
        url = reverse('grade-detail', args=[self.grade.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_grade(self):
        """Test creating a new grade."""
        url = reverse('grade-list')
        data = {'student': self.student.id, 'assignment': self.assignment.id, 'score': 88}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
