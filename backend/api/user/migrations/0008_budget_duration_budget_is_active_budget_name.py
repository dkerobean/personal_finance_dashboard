# Generated by Django 5.0.6 on 2024-07-25 13:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0007_expense_transaction_type_income_transaction_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='budget',
            name='duration',
            field=models.CharField(choices=[('weekly', 'Weekly'), ('monthly', 'Monthly'), ('yearly', 'Yearly')], default='monthly', max_length=10),
        ),
        migrations.AddField(
            model_name='budget',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='budget',
            name='name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
