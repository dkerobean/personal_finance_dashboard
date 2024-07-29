from django.urls import path
from . import views


urlpatterns = [
    path('all/', views.BudgetView.as_view(), name="budget-view"),
    path('edit/<int:pk>/', views.BudgetView.as_view, name="edit")
]

