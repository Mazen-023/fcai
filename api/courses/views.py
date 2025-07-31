from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView


from .models import Course, Module, Content, Enrollment
from .serializers import (
    CourseSerializer, 
    ModuleSerializer, 
    ContentSerializer, 
    EnrollmentSerializer
)
from courses.utils import IsCourseOwnerOrReadOnly, IsStudentOrReadOnly


# Create your views here.
@method_decorator(csrf_exempt, name='dispatch')
class CourseListDetailView(APIView):
    def get_permissions(self):
        # List is public, detail is authenticated only
        if self.request.method == 'GET':
            if self.kwargs.get('pk') is not None:
                return [AllowAny()]
            else:
                return [AllowAny()]
        elif self.request.method == 'POST':
            return [IsAuthenticated()]
        else:
            return [IsAuthenticated(), IsCourseOwnerOrReadOnly()]

    def get(self, request, pk=None):
        if pk is None:
            courses = Course.objects.all()
            serializer = CourseSerializer(courses, many=True)
            return Response({'courses': serializer.data})
        else:
            try:
                course = Course.objects.get(pk=pk)
            except Course.DoesNotExist:
                return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
            serializer = CourseSerializer(course)
            return Response(serializer.data)

    def post(self, request, pk=None):
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        try:
            course = Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
        data = request.data.copy()
        data.pop('instructor', None)
        serializer = CourseSerializer(course, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        try:
            course = Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
        course.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class ModuleListDetailView(APIView):
    def get_permissions(self):
        # List is public, detail is authenticated only
        if self.request.method == 'GET':
            if self.kwargs.get('pk') is not None:
                return [IsAuthenticated()]
            else:
                return [AllowAny()]
        elif self.request.method == 'POST':
            return [IsAuthenticated()]
        else:
            return [IsAuthenticated(), IsCourseOwnerOrReadOnly()]

    def get(self, request, pk=None):
        if pk is None:
            modules = Module.objects.all()
            serializer = ModuleSerializer(modules, many=True)
            return Response({'modules': serializer.data})
        else:
            try:
                module = Module.objects.get(pk=pk)
            except Module.DoesNotExist:
                return Response({'error': 'Module not found'}, status=status.HTTP_404_NOT_FOUND)
            serializer = ModuleSerializer(module)
            return Response(serializer.data)

    def post(self, request, pk=None):
        serializer = ModuleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        try:
            module = Module.objects.get(pk=pk)
        except Module.DoesNotExist:
            return Response({'error': 'Module not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ModuleSerializer(module, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        try:
            module = Module.objects.get(pk=pk)
        except Module.DoesNotExist:
            return Response({'error': 'Module not found'}, status=status.HTTP_404_NOT_FOUND)
        module.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class ContentListDetailView(APIView):
    def get_permissions(self):
        # List is public, detail is authenticated only
        if self.request.method == 'GET':
            if self.kwargs.get('pk') is not None:
                return [IsAuthenticated()]
            else:
                return [AllowAny()]
        elif self.request.method == 'POST':
            return [IsAuthenticated()]
        else:
            return [IsAuthenticated(), IsCourseOwnerOrReadOnly()]

    def get(self, request, pk=None):
        if pk is None:
            contents = Content.objects.all()
            serializer = ContentSerializer(contents, many=True)
            return Response({'contents': serializer.data})
        else:
            try:
                content = Content.objects.get(pk=pk)
            except Content.DoesNotExist:
                return Response({'error': 'Content not found'}, status=status.HTTP_404_NOT_FOUND)
            serializer = ContentSerializer(content)
            return Response(serializer.data)

    def post(self, request, pk=None):
        serializer = ContentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        try:
            content = Content.objects.get(pk=pk)
        except Content.DoesNotExist:
            return Response({'error': 'Content not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ContentSerializer(content, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        try:
            content = Content.objects.get(pk=pk)
        except Content.DoesNotExist:
            return Response({'error': 'Content not found'}, status=status.HTTP_404_NOT_FOUND)
        content.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class EnrollmentListDetailView(APIView):
    def get_permissions(self):
        # List is public, detail is authenticated only
        if self.request.method == 'GET':
            if self.kwargs.get('pk') is not None:
                return [IsAuthenticated()]
            else:
                return [AllowAny()]
        elif self.request.method == 'POST':
            return [IsAuthenticated()]
        else:
            return [IsAuthenticated(), IsStudentOrReadOnly()]

    def get(self, request, pk=None):
        if pk is None:
            enrollments = Enrollment.objects.all()
            serializer = EnrollmentSerializer(enrollments, many=True)
            return Response({'enrollments': serializer.data})
        else:
            try:
                enrollment = Enrollment.objects.get(pk=pk)
            except Enrollment.DoesNotExist:
                return Response({'error': 'Enrollment not found'}, status=status.HTTP_404_NOT_FOUND)
            serializer = EnrollmentSerializer(enrollment)
            return Response(serializer.data)

    def post(self, request, pk=None):
        data = request.data.copy()
        data['student'] = request.user.id  # Always use the logged-in user
        serializer = EnrollmentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        try:
            enrollment = Enrollment.objects.get(pk=pk)
        except Enrollment.DoesNotExist:
            return Response({'error': 'Enrollment not found'}, status=status.HTTP_404_NOT_FOUND)
        if not IsStudentOrReadOnly().has_object_permission(request, None, enrollment):
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = EnrollmentSerializer(enrollment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        try:
            enrollment = Enrollment.objects.get(pk=pk)
        except Enrollment.DoesNotExist:
            return Response({'error': 'Enrollment not found'}, status=status.HTTP_404_NOT_FOUND)
        if not IsStudentOrReadOnly().has_object_permission(request, None, enrollment):
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        enrollment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    