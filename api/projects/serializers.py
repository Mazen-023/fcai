from rest_framework import serializers

from .models import Assignment, Question, Answer, Grade
from accounts.models import User


# Create your serializers here.
class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'question', 'correct_answer', 'is_correct']
        read_only_fields = ['id']


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = ['id', 'assignment', 'title', 'answers']
        read_only_fields = ['id']


class AssignmentSerializer(serializers.ModelSerializer):
    module_title = serializers.CharField(source='module.title', read_only=True)
    course_title = serializers.CharField(source='module.course.title', read_only=True)
    
    class Meta:
        model = Assignment
        fields = ['id', 'module', 'title', 'order', 'min_pass_score', 'is_required', 'module_title', 'course_title']
        read_only_fields = ['id']


class AssignmentDetailSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    module_title = serializers.CharField(source='module.title', read_only=True)
    course_title = serializers.CharField(source='module.course.title', read_only=True)
    
    class Meta:
        model = Assignment
        fields = ['id', 'module', 'title', 'order', 'min_pass_score', 'is_required', 'module_title', 'course_title', 'questions']
        read_only_fields = ['id']


class GradeSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    assignment_title = serializers.CharField(source='assignment.title', read_only=True)
    
    class Meta:
        model = Grade
        fields = ['id', 'student', 'assignment', 'score', 'datetime', 'student_name', 'assignment_title']
        read_only_fields = ['id', 'datetime']


class StudentAnswerSerializer(serializers.Serializer):
    """Serializer for student answers submission"""
    question_id = serializers.IntegerField()
    answer_text = serializers.CharField(max_length=1000)
