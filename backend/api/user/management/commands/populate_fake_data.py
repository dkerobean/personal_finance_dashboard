import os
import django
from faker import Faker
from django.core.management.base import BaseCommand
from user.models import (CustomUser, Profile, Income,
                         Expense, IncomeCategory, ExpenseCategory, Budget)
from datetime import datetime, timedelta
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings')
django.setup()


class Command(BaseCommand):
    help = 'Populate the database with fake data'

    def handle(self, *args, **kwargs):
        fake = Faker()

        # Create one user
        user, created = CustomUser.objects.get_or_create(
            email=fake.email(),
            defaults={'username': 'testuser'}
        )

        if created:
            user.set_password('frogman28')
            user.save()

        Profile.objects.get_or_create(
            user=user,
            defaults={
                'full_name': fake.name(),
                'date_of_birth': fake.date_of_birth(minimum_age=18,
                                                    maximum_age=80),
                'address': fake.address(),
                'phone_number': fake.phone_number()[:15],
                'currency_symbol': fake.currency_symbol()
            }
        )

        # Create income and expense categories
        income_categories = [IncomeCategory.objects.create(name=fake.word()) for _ in range(10)] # noqa
        expense_categories = [ExpenseCategory.objects.create(name=fake.word()) for _ in range(10)] # noqa

        # Define the date range for the last 6 months
        end_date = datetime.now()
        start_date = end_date - timedelta(days=180)

        # Generate dates for the last 6 months, ensuring at least 29 days in the current month # noqa
        current_month_start = end_date.replace(day=1)
        dates = [fake.date_between(start_date=start_date,
                                   end_date=current_month_start - timedelta(days=1)) for _ in range(400)] # noqa

        # Add dates for the current month
        current_month_dates = [current_month_start + timedelta(days=i) for i in range((end_date - current_month_start).days + 1)] # noqa
        dates.extend(current_month_dates)

        # Create fake incomes
        for date in dates:
            Income.objects.create(
                user=user,
                amount=fake.pydecimal(left_digits=4, right_digits=2,
                                      positive=True),
                category=random.choice(income_categories),
                source=fake.company(),
                date=date,
                description=fake.text(max_nb_chars=100)
            )

        # Create fake expenses
        for date in dates:
            Expense.objects.create(
                user=user,
                amount=fake.pydecimal(left_digits=4,
                                      right_digits=2, positive=True),
                category=random.choice(expense_categories),
                date=date,
                description=fake.text(max_nb_chars=100)
            )

        # Create a budget for the user
        Budget.objects.create(
            user=user,
            name=fake.word(),
            target_amount=fake.pydecimal(left_digits=4,
                                         right_digits=2, positive=True),
            start_date=fake.date_between(start_date=start_date,
                                         end_date=end_date),
            duration=random.choice(['weekly', 'monthly', 'yearly']),
            is_active=True
        )

        self.stdout.write(self.style.SUCCESS('Successfully populated the database with fake data.')) # noqa