from rest_framework import serializers
from user.models import Budget


class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ['id', 'user', 'name', 'target_amount', 'duration', 'is_active', 'spent_amount']
        read_only_fields = ['start_date', 'end_date', 'spent_amount', 'id', 'user']
