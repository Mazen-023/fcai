from rest_framework.permissions import  BasePermission, SAFE_METHODS


# Create your Custom permissions here.
class IsCourseOwnerOrReadOnly(BasePermission):
    """
    Custom permission to only allow course owners to edit it.
    Read-only access is allowed for all users.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return hasattr(obj, 'instructor') and obj.instructor == request.user

class IsStudentOrReadOnly(BasePermission):
    """
    Custom permission to only allow students to edit their own records.
    Read-only access is allowed for all users.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return hasattr(obj, 'student') and obj.student == request.user