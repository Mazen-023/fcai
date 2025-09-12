from rest_framework import serializers

from .models import Course, Module, Enrollment


# Create your serializers here.

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 
            'imgURL', 'price', 'university',
            'duration', 'archived', 'gated',
            'created_at', 'updated_at', 'instructor']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = ['id', 'title', 'description', 'order', 'course']
        read_only_fields = ['id']


class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['id', 'course', 'student', 'enroll_datetime', 'completed_datetime']
        read_only_fields = ['id', 'enroll_datetime', 'completed_datetime']
