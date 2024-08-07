from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .tf_models import ExpensePredictionModel, FinancialHealthScoreModel, SmartBudgetRecommendationModel, PredictiveInsightsModel, ExpenseCategorizationModel
from rest_framework.permissions import IsAuthenticated
from user.models import Income, Expense, NetWorth, CustomUser
from datetime import datetime, timedelta
import numpy as np


class ExpensePredictionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        model = ExpensePredictionModel()

        try:
            prediction = model.predict(user)
            return Response({'prediction': prediction.tolist()})
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class FinancialHealthScoreView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        model = FinancialHealthScoreModel()

        model.train([user])

        health_score = model.predict_health_score(user)
        return Response({"financial_health_score": health_score})


class SmartBudgetRecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        model = SmartBudgetRecommendationModel()
        expected_income = float(request.query_params.get('expected_income', 0))

        try:
            recommendation = model.recommend_budget(user, expected_income)
            return Response({'recommendation': recommendation})
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class PredictiveInsightsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        model = PredictiveInsightsModel()

        try:
            prediction = model.predict(user)
            return Response({'prediction': prediction.tolist()})
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class TrainAllModelsView(APIView):
    def post(self, request, *args, **kwargs):
        user = request.user  # Assumes the user is authenticated and provided

        # Initialize models
        expense_categorization_model = ExpenseCategorizationModel()
        predictive_insights_model = PredictiveInsightsModel()
        smart_budget_recommendation_model = SmartBudgetRecommendationModel()

        try:
            # Train each model
            expense_categorization_model.train(user)
            predictive_insights_model.train(user)
            smart_budget_recommendation_model.train(user)
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'status': 'success', 'message': 'All models trained successfully.'}, status=status.HTTP_200_OK)