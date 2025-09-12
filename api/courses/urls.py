from django.urls import path

from . import views

urlpatterns = [
    # Course endpoints
    path('courses/', views.course_list, name='course-list'),
    path('courses/<int:pk>/', views.course_detail, name='course-detail'),

    # Module endpoints
    path('modules/', views.module_list, name='module-list'),
    path('modules/<int:pk>/', views.module_detail, name='module-detail'),

    # Enrollment endpoints
    path('enrollments/', views.enrollment_list, name='enrollment-list'),
    path('enrollments/<int:pk>/', views.enrollment_detail, name='enrollment-detail'),
]
