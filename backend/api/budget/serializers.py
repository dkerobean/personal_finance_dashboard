from rest_framework import serializers
from user.models import Budget


class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ['user', 'name', 'category', 'target_amount', 'duration']
        read_only_fields = ['spent_amount', 'is_active', 'start_date', 'end_date', 'is_active',]
