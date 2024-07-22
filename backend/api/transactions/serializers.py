from rest_framework import serializers
from user.models import Income, Expense, IncomeCategory, ExpenseCategory


class IncomeCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = IncomeCategory
        fields = ['id', 'name']


class ExpenseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseCategory
        fields = ['id', 'name']


class IncomeSerializer(serializers.ModelSerializer):
    category = IncomeCategorySerializer()

    class Meta:
        model = Income
        fields = ['amount', 'category', 'source', 'date', 'description', 'user', 'transaction_type']


class ExpenseSerializer(serializers.ModelSerializer):
    category = ExpenseCategorySerializer()

    class Meta:
        model = Expense
        fields = ['user', 'amount', 'category', 'date', 'description', 'transaction_type']
