# Generated by Django 5.0.6 on 2024-07-22 11:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0005_expensecategory_incomecategory_expense_budget_income_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='net_worth',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=15),
        ),
    ]
