from django.contrib import admin
from user.models import (ExpenseCategory, IncomeCategory,
                         Income, Expense, Budget)

# Register your models here.
admin.site.register(ExpenseCategory)
admin.site.register(IncomeCategory)
admin.site.register(Income)
admin.site.register(Expense)
admin.site.register(Budget)