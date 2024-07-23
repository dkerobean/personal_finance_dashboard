from django.urls import path
from . import views


urlpatterns = [
    path('income/', views.IncomeView.as_view(), name='income'),
    path('income/category/', views.IncomeCategoryView.as_view(), name='income-category'),

    path('expense/', views.ExpenseView.as_view(), name='expense'),
    path('expense/category/', views.ExpenseCategoryView.as_view(), name='expense-category'),
    
    path('all/', views.TransactionsView.as_view(), name='transactions'),
]

