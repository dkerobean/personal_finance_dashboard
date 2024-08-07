
from django.urls import path
from . import views

urlpatterns = [
    path('expense-prediction/', views.ExpensePredictionView.as_view(), name='expense-prediction'),
    path('financial-health-score/', views.FinancialHealthScoreView.as_view(), name='financial-health-score'),
    path('smart-budget-recommendation/', views.SmartBudgetRecommendationView.as_view(), name='smart-budget-recommendation'),

    path('predictive-insights/', views.PredictiveInsightsView.as_view(), name='predictive-insights'),

    path('train-all-models/', views.TrainAllModelsView.as_view(), name='train-all-models'),

]
