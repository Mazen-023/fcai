from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView

from .models import Assignment, Question, Answer, Grade
from .serializers import (
    AssignmentSerializer,
    AssignmentDetailSerializer,
    QuestionSerializer,
    AnswerSerializer,
    GradeSerializer,
    StudentAnswerSerializer
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
            serializer = AssignmentDetailSerializer(assignment)
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


@method_decorator(csrf_exempt, name='dispatch')
class SubmitAssignmentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, assignment_id):
        """Submit assignment answers and calculate grade"""
        try:
            assignment = Assignment.objects.get(pk=assignment_id)
        except Assignment.DoesNotExist:
            return Response({'error': 'Assignment not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check if student already has a grade for this assignment
        if Grade.objects.filter(student=request.user, assignment=assignment).exists():
            return Response({'error': 'Assignment already submitted'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate answers format
        answers_data = request.data.get('answers', [])
        if not answers_data:
            return Response({'error': 'No answers provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate score
        total_questions = assignment.questions.count()
        if total_questions == 0:
            return Response({'error': 'Assignment has no questions'}, status=status.HTTP_400_BAD_REQUEST)

        correct_answers = 0
        for answer_data in answers_data:
            try:
                question = Question.objects.get(id=answer_data.get('question_id'), assignment=assignment)
                correct_answer = Answer.objects.filter(question=question, is_correct=True).first()
                
                if correct_answer and correct_answer.correct_answer.lower().strip() == answer_data.get('answer_text', '').lower().strip():
                    correct_answers += 1
            except Question.DoesNotExist:
                continue

        # Calculate percentage score
        score = (correct_answers / total_questions) * 100

        # Create grade record
        grade = Grade.objects.create(
            student=request.user,
            assignment=assignment,
            score=score
        )

        serializer = GradeSerializer(grade)
        return Response({
            'grade': serializer.data,
            'correct_answers': correct_answers,
            'total_questions': total_questions,
            'passed': score >= assignment.min_pass_score
        }, status=status.HTTP_201_CREATED)
