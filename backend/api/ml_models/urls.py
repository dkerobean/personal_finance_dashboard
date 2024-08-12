
from django.urls import path
from . import views
from . import train_models

urlpatterns = [
    path('financial-health-score/', views.FinancialHealthScoreView.as_view(), name='financial-health-score'), # noqa
    path('budget-recommendation/', views.SmartBudgetRecommendationView.as_view(), name='smart-budget-recommendation'), # noqa
    path('predictive-insights/', views.PredictiveInsightsView.as_view(), name='predictive-insights'), # noqa

    path('train-models/', train_models.TrainAllModelsView.as_view(), name='train_models'), # noqa

]
