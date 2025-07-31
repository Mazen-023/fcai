from rest_framework import serializers

from .models import Assignment, Question, Answer, Grade


# Create your serializers here.
class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ['id', 'module', 'title', 'order', 'min_pass_score', 'is_required']
        read_only_fields = ['id']


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'assignment', 'title']
        read_only_fields = ['id']


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'question', 'correct_answer', 'is_correct']
        read_only_fields = ['id']


class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = ['id', 'student', 'assignment', 'score', 'datetime']
        read_only_fields = ['id', 'datetime']
