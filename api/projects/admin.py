from django.contrib import admin

from .models import Assignment, Question, Answer, Grade

# Register your models here.
admin.site.register(Assignment)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(Grade)