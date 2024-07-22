from django.contrib import admin
from .models import (CustomUser, Profile,
                     IncomeCategory, ExpenseCategory)

# Register your models here.
admin.site.register(CustomUser)
admin.site.register(Profile)
admin.site.register(ExpenseCategory)
admin.site.register(IncomeCategory)

