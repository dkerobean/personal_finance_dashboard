from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .tf_models import ExpenseCategorizationModel, PredictiveInsightsModel, SmartBudgetRecommendationModel

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