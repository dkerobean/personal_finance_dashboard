from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import BudgetSerializer
from rest_framework.permissions import IsAuthenticated
from user.models import Budget
from django.shortcuts import get_object_or_404


class BudgetView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        budgets = Budget.objects.all()
        serializer = BudgetSerializer(budgets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = BudgetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_401_BAD_REQUEST)

    def put(self, request, pk):
        budget = get_object_or_404(Budget, id=pk, user=request.user)
        serializer = BudgetSerializer(budget, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        budget = get_object_or_404(Budget, id=pk, user=request.user)
        budget.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



