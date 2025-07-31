from django.db import models
from accounts.models import User


# Create your models here.
class Course(models.Model):
    title = models.CharField(max_length=255)
    imgURL = models.URLField()
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    university = models.CharField(max_length=100)
    duration = models.CharField(max_length=100)
    archived = models.BooleanField(default=False)
    gated = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    instructor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses')

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']


class Module(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')

    def __str__(self):
        return f"{self.title} ({self.course.title})"

    class Meta:
        ordering = ['order']


class Content(models.Model):
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=50)  # e.g. 'video', 'pdf', 'text', etc.
    url = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='contents')

    def __str__(self):
        return f"{self.title} ({self.module.title})"
    
    class Meta:
        ordering = ['order']



class Enrollment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    student = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='enrollments')
    enroll_datetime = models.DateTimeField(auto_now_add=True)
    completed_datetime = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.student.username} in {self.course.title}"
    