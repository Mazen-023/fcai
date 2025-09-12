from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('instructor', 'Instructor'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    
    @property
    def is_instructor(self):
        return self.role == 'instructor'
        
    @property
    def is_student(self):
        return self.role == 'student'

    class Meta:
        ordering = ['-id']