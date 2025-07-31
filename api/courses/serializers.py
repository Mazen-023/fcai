from rest_framework import serializers

from .models import Course, Module, Content, Enrollment


# Create your serializers here.
class CourseSerializer(serializers.ModelSerializer):
    def get_extra_kwargs(self):
        # Make instructor required for POST, but read-only for update
        extra_kwargs = super().get_extra_kwargs() or {}
        request = self.context.get('request', None)
        if request and request.method in ['PUT', 'PATCH']:
            extra_kwargs['instructor'] = {'read_only': True}
        else:
            extra_kwargs['instructor'] = {'required': True}
        return extra_kwargs

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


class ContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Content
        fields = ['id', 'title', 'type', 'url', 'order', 'module']
        read_only_fields = ['id']


class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['id', 'course', 'student', 'enroll_datetime', 'completed_datetime']
        read_only_fields = ['id', 'enroll_datetime', 'completed_datetime']
