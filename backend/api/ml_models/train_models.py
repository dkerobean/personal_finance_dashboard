from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from django.contrib.auth import get_user_model
from .tf_models import (FinancialHealthScoreModel,
                        SmartBudgetRecommendationModel,
                        PredictiveInsightsModel)
import concurrent.futures


class TrainAllModelsView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        User = get_user_model()
        users = User.objects.all()

        try:
            with concurrent.futures.ThreadPoolExecutor() as executor:
                # Train models concurrently
                futures = [
                    executor.submit(self.train_financial_health_score_model, users), # noqa
                    executor.submit(self.train_smart_budget_recommendation_model, users), # noqa
                    executor.submit(self.train_predictive_insights_model, users)  # noqa
                ]

                # Wait for all futures to complete
                for future in concurrent.futures.as_completed(futures):
                    if future.exception() is not None:
                        raise future.exception()

            return Response({'message': 'All models trained successfully'},
                            status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)},
                            status=status.HTTP_400_BAD_REQUEST)

    def train_financial_health_score_model(self, users):
        model = FinancialHealthScoreModel()
        model.train(users)

    def train_smart_budget_recommendation_model(self, users):
        model = SmartBudgetRecommendationModel()
        model.train(users)

    def train_predictive_insights_model(self, users):
        model = PredictiveInsightsModel()
        model.train(users)
