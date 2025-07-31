from django.urls import path

from . import views

urlpatterns = [
    path('courses/', views.CourseListDetailView.as_view(), name='course-list'),
    path('courses/<int:pk>/', views.CourseListDetailView.as_view(), name='course-detail'),
    path('modules/', views.ModuleListDetailView.as_view(), name='module-list'),
    path('modules/<int:pk>/', views.ModuleListDetailView.as_view(), name='module-detail'),
    path('contents/', views.ContentListDetailView.as_view(), name='content-list'),
    path('contents/<int:pk>/', views.ContentListDetailView.as_view(), name='content-detail'),
    path('enrollments/', views.EnrollmentListDetailView.as_view(), name='enrollment-list'),
    path('enrollments/<int:pk>/', views.EnrollmentListDetailView.as_view(), name='enrollment-detail'),
]
