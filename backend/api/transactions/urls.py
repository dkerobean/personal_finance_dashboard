from django.urls import path
from . import views


urlpatterns = [
    path('income/', views.IncomeView.as_view(), name='income'),
    path('expense/', views.ExpenseView.as_view(), name='expense'),
    path('all/', views.TransactionsView.as_view(), name='transactions'),
]

