from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView

from .models import Assignment, Question, Answer, Grade
from .serializers import (
    AssignmentSerializer,
    QuestionSerializer,
    AnswerSerializer,
    GradeSerializer
)
from courses.utils import IsCourseOwnerOrReadOnly, IsStudentOrReadOnly


# Create your views here.
@method_decorator(csrf_exempt, name='dispatch')
class AssignmentListDetailView(APIView):
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
            assignments = Assignment.objects.all()
            serializer = AssignmentSerializer(assignments, many=True)
            return Response({'assignments': serializer.data})
        else:
            try:
                assignment = Assignment.objects.get(pk=pk)
            except Assignment.DoesNotExist:
                return Response({'error': 'Assignment not found'}, status=status.HTTP_404_NOT_FOUND)
            serializer = AssignmentSerializer(assignment)
            return Response(serializer.data)

    def post(self, request, pk=None):
        serializer = AssignmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        try:
            assignment = Assignment.objects.get(pk=pk)
        except Assignment.DoesNotExist:
            return Response({'error': 'Assignment not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = AssignmentSerializer(assignment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        try:
            assignment = Assignment.objects.get(pk=pk)
        except Assignment.DoesNotExist:
            return Response({'error': 'Assignment not found'}, status=status.HTTP_404_NOT_FOUND)
        assignment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class QuestionListDetailView(APIView):
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
            questions = Question.objects.all()
            serializer = QuestionSerializer(questions, many=True)
            return Response({'questions': serializer.data})
        else:
            try:
                question = Question.objects.get(pk=pk)
            except Question.DoesNotExist:
                return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)
            serializer = QuestionSerializer(question)
            return Response(serializer.data)

    def post(self, request, pk=None):
        serializer = QuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        try:
            question = Question.objects.get(pk=pk)
        except Question.DoesNotExist:
            return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = QuestionSerializer(question, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        try:
            question = Question.objects.get(pk=pk)
        except Question.DoesNotExist:
            return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)
        question.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class AnswerListDetailView(APIView):
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
            answers = Answer.objects.all()
            serializer = AnswerSerializer(answers, many=True)
            return Response({'answers': serializer.data})
        else:
            try:
                answer = Answer.objects.get(pk=pk)
            except Answer.DoesNotExist:
                return Response({'error': 'Answer not found'}, status=status.HTTP_404_NOT_FOUND)
            serializer = AnswerSerializer(answer)
            return Response(serializer.data)

    def post(self, request, pk=None):
        serializer = AnswerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        try:
            answer = Answer.objects.get(pk=pk)
        except Answer.DoesNotExist:
            return Response({'error': 'Answer not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = AnswerSerializer(answer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        try:
            answer = Answer.objects.get(pk=pk)
        except Answer.DoesNotExist:
            return Response({'error': 'Answer not found'}, status=status.HTTP_404_NOT_FOUND)
        answer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@method_decorator(csrf_exempt, name='dispatch')
class GradeListDetailView(APIView):
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
            grades = Grade.objects.all()
            serializer = GradeSerializer(grades, many=True)
            return Response({'grades': serializer.data})
        else:
            try:
                grade = Grade.objects.get(pk=pk)
            except Grade.DoesNotExist:
                return Response({'error': 'Grade not found'}, status=status.HTTP_404_NOT_FOUND)
            serializer = GradeSerializer(grade)
            return Response(serializer.data)

    def post(self, request, pk=None):
        serializer = GradeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        try:
            grade = Grade.objects.get(pk=pk)
        except Grade.DoesNotExist:
            return Response({'error': 'Grade not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = GradeSerializer(grade, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        try:
            grade = Grade.objects.get(pk=pk)
        except Grade.DoesNotExist:
            return Response({'error': 'Grade not found'}, status=status.HTTP_404_NOT_FOUND)
        grade.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
