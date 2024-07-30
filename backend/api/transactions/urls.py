from django.urls import path
from . import views


urlpatterns = [
    path('income/', views.IncomeView.as_view(), name='income'),
    path('income/<int:pk>/', views.IncomeView.as_view(), name="edit-income"),
    path('income/category/', views.IncomeCategoryView.as_view(), name='income-category'),
    path('income/detail/<int:pk>/', views.IncomeDetailView.as_view(), name='income-detail'),

    path('expense/', views.ExpenseView.as_view(), name='expense'),
    path('expense/<int:pk>/', views.ExpenseView.as_view(), name="edit-expense"),
    path('expense/category/', views.ExpenseCategoryView.as_view(), name='expense-category'),
    path('expense/detail/<int:pk>/', views.ExpenseDetailView.as_view(), name='expense-detail'),

    path('all/', views.TransactionsView.as_view(), name='transactions'),

    path('cashflow/', views.CashflowView.as_view(), name='cashflow'),
    path('balance-trend/', views.BalanceTrendView.as_view(), name='balance-trend'),
]

