from django.urls import reverse
from rest_framework.test import APITestCase

from .models import User


# Create your tests here.
class AuthenticationTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpass')

    def test_valid_login(self):
        """Check if users can login with valid credentials"""
        # URL for endpoint
        url = reverse('login')

        # Data to be sent in the request
        data = {
            'username': 'testuser',
            'password': 'testpass'
            }
        
        # Make a request to the endpoint
        response = self.client.post(url, data)

        # Check the response status code
        self.assertEqual(response.status_code, 200)

        # Check if the response contains the expected data
        self.assertIn(response.data['message'], 'Login successful')

    def test_invalid_login(self):
        """Check if users cannot login with invalid credentials"""
        url = reverse('login')
        data = {
            'username': 'testuser',
            'password': 'wrongpass'
            }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 404)

    def test_valid_register(self):
        """Check if users can register with valid credentials"""
        url = reverse('register')
        data = {
            'username': 'mazen',
            'email': 'mazen@example.com',
            'password': 'mazen123',
            'confirmation': 'mazen123',
            'role': 'student',
            }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)

    def test_wrong_confirmation(self):
        """Check if users cannot register with mismatched passwords"""
        url = reverse('register')
        data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'testpass',
            'confirmation': 'wrongconfirmation'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 400)

    def test_username_taken(self):
        """Check if users cannot register with an already taken username"""
        url = reverse('register')
        data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'testpass',
            'confirmation': 'testpass'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 400)

    def test_logout(self):
        """Check if users can logout"""
        url = reverse('logout')
        response = self.client.post(url)
        self.assertEqual(response.status_code, 200)