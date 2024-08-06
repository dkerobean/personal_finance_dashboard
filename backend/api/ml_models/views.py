
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .tf_models import ExpensePredictionModel, AnomalyDetectionModel, IncomeTrendAnalysisModel, NetWorthForecastingModel
from rest_framework.permissions import IsAuthenticated
from user.models import Income, Expense
from datetime import datetime
import numpy as np


class ExpensePredictionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        model = ExpensePredictionModel()
        model.train(user)

        last_expense = Expense.objects.filter(user=user).order_by('-date').first()
        if not last_expense:
            return Response({"error": "No expense data available"}, status=status.HTTP_400_BAD_REQUEST)

        prediction = model.predict(float(last_expense.amount))

        return Response({
            'predicted_expense': float(prediction[0][0])
        })


class AnomalyDetectionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        model = AnomalyDetectionModel()
        model.train(user)

        current_month = datetime.now().month
        expenses = Expense.objects.filter(user=user, date__month=current_month)
        amounts = [float(expense.amount) for expense in expenses]

        if len(amounts) < 2:
            return Response({"error": "Not enough data for anomaly detection"},
                            status=status.HTTP_400_BAD_REQUEST)

        anomalies = model.detect_anomalies(np.array(amounts))

        return Response({
            'anomalies': anomalies.tolist()
        })


class NetWorthForecastingView(APIView):
    permission_classes = [IsAuthenticated]

    # def get(self, request):
    #     user = request.user
    #     model = NetWorthForecastingModel()
    #     model.train(user)

    #     last_net_worth = user.net_worths.all().order_by('-date').first()
    #     if not last_net_worth:
    #         return Response({"error": "No net worth data available"}, status=status.HTTP_400_BAD_REQUEST)

    #     prediction = model.predict(float(last_net_worth.net_worth))

    #     return Response({
    #         'predicted_net_worth': float(prediction[0][0])
    #     })

    def get(self, request):
        user = request.user
        periods = int(request.query_params.get('periods', 12))

        model = NetWorthForecastingModel()
        model.train(user)
        forecasts = model.forecast(user, periods)

        return Response({'net_worth_forecast': forecasts})


class IncomeTrendAnalysisView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        model = IncomeTrendAnalysisModel()
        model.train(user)

        last_income = Income.objects.filter(user=user).order_by('-date').first()
        if not last_income:
            return Response({"error": "No income data available"}, status=status.HTTP_400_BAD_REQUEST)

        prediction = model.predict(float(last_income.amount))

        return Response({
            'predicted_income': float(prediction[0][0])
        })


