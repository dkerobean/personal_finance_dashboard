# Generated by Django 5.0.6 on 2024-07-28 09:21

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0011_alter_budget_start_date'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='budget',
            name='category',
        ),
        migrations.AddField(
            model_name='profile',
            name='cash_flow',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=15),
        ),
        migrations.AddField(
            model_name='profile',
            name='total_spending',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=15),
        ),
        migrations.AlterField(
            model_name='budget',
            name='start_date',
            field=models.DateField(default=datetime.date(2024, 7, 28)),
        ),
    ]
