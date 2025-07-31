from django.db import models

from courses.models import Module
from accounts.models import User

# Create your models here.
class Assignment(models.Model):
    title = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)
    min_pass_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    is_required = models.BooleanField(default=True)
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='assignments')

    def __str__(self):
        return f"{self.title} ({self.module.title})"


class Question(models.Model):
    title = models.CharField(max_length=255)
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='questions')

    def __str__(self):
        return f"{self.title} ({self.assignment.title})"


class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    correct_answer = models.TextField()
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"Answer to {self.question.title}"


class Grade(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='grades')
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='grades')
    score = models.DecimalField(max_digits=5, decimal_places=2)
    datetime = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'assignment')

    def __str__(self):
        return f"{self.student.username} - {self.assignment.title}: {self.score}"
