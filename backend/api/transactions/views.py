from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import IncomeSerializer, ExpenseSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.permissions import IsAuthenticated
from user.models import Income, Expense


class IncomeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        incomes = Income.objects.all()
        serializer = IncomeSerializer(incomes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = IncomeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExpenseView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        expenses = Expense.objects.all()
        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ExpenseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TransactionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        income_query = Income.objects.filter(user=user)
        expense_query = Expense.objects.filter(user=user)

        # Filtering
        filter_type = request.query_params.get('type')
        if filter_type == 'income':
            expenses = []
            incomes = income_query
        elif filter_type == 'expense':
            incomes = []
            expenses = expense_query
        else:
            incomes = income_query
            expenses = expense_query

        income_serializer = IncomeSerializer(incomes, many=True)
        expense_serializer = ExpenseSerializer(expenses, many=True)

        return Response({
            'incomes': income_serializer.data,
            'expenses': expense_serializer.data
        })