from django.urls import path

from . import views

urlpatterns = [
    path('assignments/', views.AssignmentListDetailView.as_view(), name='assignment-list'),
    path('assignments/<int:pk>/', views.AssignmentListDetailView.as_view(), name='assignment-detail'),
    path('questions/', views.QuestionListDetailView.as_view(), name='question-list'),
    path('questions/<int:pk>/', views.QuestionListDetailView.as_view(), name='question-detail'),
    path('answers/', views.AnswerListDetailView.as_view(), name='answer-list'),
    path('answers/<int:pk>/', views.AnswerListDetailView.as_view(), name='answer-detail'),
    path('grades/', views.GradeListDetailView.as_view(), name='grade-list'),
    path('grades/<int:pk>/', views.GradeListDetailView.as_view(), name='grade-detail'),
]
