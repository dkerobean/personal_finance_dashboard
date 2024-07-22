from rest_framework import serializers
from user.models import Income, Expense


class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = ['amount', 'category', 'source', 'date', 'description', 'user']


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['user', 'amount', 'category', 'date', 'description']