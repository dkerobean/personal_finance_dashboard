from rest_framework import serializers
from user.models import (Income, Expense,
                         IncomeCategory, ExpenseCategory,
                         Budget)


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
        fields = ['id', 'amount', 'category', 'source',
                  'date', 'description', 'user',
                  'transaction_type']

    def create(self, validated_data):
        category_data = validated_data.pop('category')
        category, created = IncomeCategory.objects.get_or_create(**category_data) # noqa
        income = Income.objects.create(category=category, **validated_data)
        return income

    def update(self, instance, validated_data):
        category_data = validated_data.pop('category', None)
        if category_data:
            category, created = IncomeCategory.objects.get_or_create(**category_data) # noqa
            instance.category = category

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class ExpenseSerializer(serializers.ModelSerializer):
    category = ExpenseCategorySerializer()

    class Meta:
        model = Expense
        fields = ['id', 'user', 'amount', 'category',
                  'date', 'description', 'transaction_type']

    def create(self, validated_data):
        category_data = validated_data.pop('category')
        category, created = ExpenseCategory.objects.get_or_create(**category_data) # noqa
        expense = Expense.objects.create(category=category, **validated_data)
        return expense

    def update(self, instance, validated_data):
        category_data = validated_data.pop('category', None)
        if category_data:
            category, created = ExpenseCategory.objects.get_or_create(**category_data) # noqa
            instance.category = category

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = '__all__'
