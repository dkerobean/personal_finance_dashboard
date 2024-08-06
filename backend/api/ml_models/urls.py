
from django.urls import path
from . import views

urlpatterns = [
    path('predict-expenses/', views.ExpensePredictionView.as_view(), name='predict_expenses'),
    path('detect-anomalies/', views.AnomalyDetectionView.as_view(), name='detect_anomalies'),
    path('net-worth-forecast/', views.NetWorthForecastingView.as_view(), name='net_worth_forecast'),
    path('income-trend-analysis/', views.IncomeTrendAnalysisView.as_view(), name='income_trend_analysis'),
]