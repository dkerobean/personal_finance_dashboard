from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import (IncomeSerializer, ExpenseSerializer,
                          IncomeCategorySerializer, ExpenseCategorySerializer)
from rest_framework.permissions import IsAuthenticated
from user.models import Income, Expense, IncomeCategory, ExpenseCategory
from django.shortcuts import get_object_or_404


class IncomeCategoryView(APIView):
    def get(self, request):
        income_categories = IncomeCategory.objects.all()
        serializer = IncomeCategorySerializer(income_categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ExpenseCategoryView(APIView):
    def get(self, request):
        expense_categories = ExpenseCategory.objects.all()
        serializer = ExpenseCategorySerializer(expense_categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class IncomeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        incomes = Income.objects.all()
        serializer = IncomeSerializer(incomes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = IncomeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        income = get_object_or_404(Income, id=pk, user=request.user)
        serializer = IncomeSerializer(income, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        income = get_object_or_404(Income, id=pk, user=request.user)
        income.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class IncomeDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        income = get_object_or_404(Income, id=pk, user=request.user)
        serializer = IncomeSerializer(income)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ExpenseView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        expenses = Expense.objects.all()
        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ExpenseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        expense = get_object_or_404(Expense, id=pk, user=request.user)
        serializer = ExpenseSerializer(expense, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        expense = get_object_or_404(Expense, id=pk, user=request.user)
        expense.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ExpenseDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        expense = get_object_or_404(Expense, id=pk, user=request.user)
        serializer = ExpenseSerializer(expense)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TransactionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        income_query = Income.objects.filter(user=user).order_by('-date')
        expense_query = Expense.objects.filter(user=user).order_by('-date')

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
