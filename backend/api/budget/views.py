from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import BudgetSerializer
from rest_framework.permissions import IsAuthenticated
from user.models import Budget


class BudgetView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        budgets = Budget.objects.all()
        serializer = BudgetSerializer(budgets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

