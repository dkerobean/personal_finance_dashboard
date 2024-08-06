import os
import django
from faker import Faker
from django.core.management.base import BaseCommand
from user.models import CustomUser, Profile, Income, Expense, IncomeCategory, ExpenseCategory, Budget
from datetime import datetime, timedelta
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'your_project_name.settings')
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

        if created:  # Set password only if the user was created
            user.set_password('frogman28')
            user.save()

        # Ensure the profile is only created if it does not already exist
        Profile.objects.get_or_create(
            user=user,
            defaults={
                'full_name': fake.name(),
                'date_of_birth': fake.date_of_birth(minimum_age=18, maximum_age=80),
                'address': fake.address(),
                'phone_number': fake.phone_number()[:15],
                'currency_symbol': fake.currency_symbol()
            }
        )

        # Create income and expense categories
        income_categories = [IncomeCategory.objects.create(name=fake.word()) for _ in range(10)]
        expense_categories = [ExpenseCategory.objects.create(name=fake.word()) for _ in range(10)]

        # Define the date range for the last 6 months
        start_date = datetime.now() - timedelta(days=180)

        # Create fake incomes
        for _ in range(400):
            Income.objects.create(
                user=user,
                amount=fake.pydecimal(left_digits=4, right_digits=2, positive=True),
                category=random.choice(income_categories),
                source=fake.company(),
                date=fake.date_between(start_date=start_date, end_date='today'),
                description=fake.text(max_nb_chars=100)
            )

        # Create fake expenses
        for _ in range(400):
            Expense.objects.create(
                user=user,
                amount=fake.pydecimal(left_digits=4, right_digits=2, positive=True),
                category=random.choice(expense_categories),
                date=fake.date_between(start_date=start_date, end_date='today'),
                description=fake.text(max_nb_chars=100)
            )

        # Create a budget for the user
        Budget.objects.create(
            user=user,
            name=fake.word(),
            target_amount=fake.pydecimal(left_digits=4, right_digits=2, positive=True),
            start_date=fake.date_between(start_date=start_date, end_date='today'),
            duration=random.choice(['weekly', 'monthly', 'yearly']),
            is_active=True
        )

        self.stdout.write(self.style.SUCCESS('Successfully populated the database with fake data.'))
