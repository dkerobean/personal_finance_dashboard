from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .tf_models import (FinancialHealthScoreModel,
                        SmartBudgetRecommendationModel,
                        PredictiveInsightsModel)
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from django.db.models import Avg
import numpy as np

from django.contrib.auth.mixins import UserPassesTestMixin
from django.core.cache import cache
from django.db import transaction
from user.models import Income


class FinancialHealthScoreView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        model = FinancialHealthScoreModel()
        try:
            score = model.predict_health_score(user)
            return Response({'financial_health_score': score}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class SmartBudgetRecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        try:
            # Calculate expected income based on average of last 3 months
            expected_income = self.calculate_expected_income(user)

            # Ensure expected_income is passed as a NumPy array
            expected_income_array = np.array([expected_income])

            model = SmartBudgetRecommendationModel()
            recommendation = model.recommend_budget(user, expected_income_array)

            # Add the calculated expected income to the response
            recommendation['expected_income'] = expected_income

            return Response(recommendation, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def calculate_expected_income(self, user):
        end_date = timezone.now()
        start_date = end_date - timedelta(days=90)  # Last 3 months

        avg_income = Income.objects.filter(
            user=user,
            date__range=[start_date, end_date]
        ).aggregate(Avg('amount'))['amount__avg']

        if avg_income is None:
            raise ValueError("No income data available for the last 3 months")

        return float(avg_income)


class PredictiveInsightsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        model = PredictiveInsightsModel()
        try:
            prediction = model.predict(user)
            return Response(prediction, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


