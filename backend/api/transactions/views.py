from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import (IncomeSerializer, ExpenseSerializer,
                          IncomeCategorySerializer, ExpenseCategorySerializer)
from rest_framework.permissions import IsAuthenticated
from user.models import Income, Expense, IncomeCategory, ExpenseCategory, Profile, NetWorth
from django.shortcuts import get_object_or_404
from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum


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


# Get last 6 months of income and expenses
class CashflowView(APIView):

    def get(self, request):
        user = request.user
        today = timezone.now().date()
        six_months_ago = today - timedelta(days=180)

        # Get expenses and income for the last six months
        expenses = Expense.objects.filter(user=user, date__gte=six_months_ago).values('date__month').annotate(total=Sum('amount')).order_by('date__month')
        income = Income.objects.filter(user=user, date__gte=six_months_ago).values('date__month').annotate(total=Sum('amount')).order_by('date__month')

        data = {
            'labels': [],
            'income': [],
            'expenses': []
        }

        # Initialize data for the last six months to 0
        for i in range(6):
            month = (today - timedelta(days=i * 30)).month
            data['labels'].append(month)
            data['income'].append(0)
            data['expenses'].append(0)

        # Update data with actual expense and income values
        for exp in expenses:
            month = exp['date__month']
            if month in data['labels']:
                index = data['labels'].index(month)
                data['expenses'][index] = exp['total']

        for inc in income:
            month = inc['date__month']
            if month in data['labels']:
                index = data['labels'].index(month)
                data['income'][index] = inc['total']

        return Response(data)


class BalanceTrendView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get the user
        user = request.user

        # Calculate start and end dates for the current month
        today = timezone.now().date()
        start_date = today.replace(day=1)
        end_date = (start_date + timedelta(days=31)).replace(day=1) - timedelta(days=1)

        # Generate a list of dates for the current month
        date_list = [start_date + timedelta(days=i) for i in range((end_date - start_date).days + 1)]

        # Fetch net worths for the current month
        net_worths = NetWorth.objects.filter(user=user, date__range=[start_date, end_date]).order_by('date')
        records_dict = {record.date: record.net_worth for record in net_worths}

        # Prepare data for the response
        result = []
        for date in date_list:
            result.append({
                "date": date.strftime('%Y-%m-%d'),
                "balance": records_dict.get(date, 0)  # Use 0 if no record exists for that date
            })

        return Response(result, status=status.HTTP_200_OK)
