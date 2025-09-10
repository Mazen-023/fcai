from rest_framework import serializers

from .models import Course, Module, Content, Enrollment


# Create your serializers here.

class ContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Content
        fields = ['id', 'title', 'type', 'url', 'order', 'module']
        read_only_fields = ['id']


class ModuleSerializer(serializers.ModelSerializer):
    contents = ContentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Module
        fields = ['id', 'title', 'description', 'order', 'course', 'contents']
        read_only_fields = ['id']


class CourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source='instructor.username', read_only=True)
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 
            'imgURL', 'price', 'university',
            'duration', 'archived', 'gated',
            'created_at', 'updated_at', 'instructor', 'instructor_name']
        read_only_fields = ['id', 'created_at', 'updated_at']


class CourseDetailSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    instructor_name = serializers.CharField(source='instructor.username', read_only=True)
    enrollment_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 
            'imgURL', 'price', 'university',
            'duration', 'archived', 'gated',
            'created_at', 'updated_at', 'instructor', 'instructor_name',
            'modules', 'enrollment_count']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_enrollment_count(self, obj):
        return obj.enrollments.count()


class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['id', 'course', 'student', 'enroll_datetime', 'completed_datetime']
        read_only_fields = ['id', 'enroll_datetime', 'completed_datetime']
