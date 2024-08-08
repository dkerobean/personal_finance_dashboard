from django.db import models
from django.contrib.auth.models import (AbstractBaseUser,
                                        PermissionsMixin,
                                        BaseUserManager)
import uuid
from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum
from datetime import datetime


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=100)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email


class Profile(models.Model):
    profile_id = models.UUIDField(default=uuid.uuid4, unique=True,
                                  editable=False)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255)
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    currency_symbol = models.CharField(max_length=5, default='₵', null=True,
                                       blank=True)
    net_worth = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    cash_flow = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_spending = models.DecimalField(max_digits=15, decimal_places=2,
                                         default=0)

    def __str__(self):
        return self.user.username

    def calculate_cash_flow(self):
        total_income = self.user.incomes.aggregate(total=models.Sum('amount'))['total'] or 0 # noqa
        total_expenses = self.user.expenses.aggregate(total=models.Sum('amount'))['total'] or 0 # noqa
        return total_income - total_expenses

    def calculate_total_spending(self):
        return self.user.expenses.aggregate(total=models.Sum('amount'))['total'] or 0 # noqa

    def update_financials(self):
        self.cash_flow = self.calculate_cash_flow()
        self.total_spending = self.calculate_total_spending()
        self.save()

    def get_top_expenses(self):
        current_month = datetime.now().month
        current_year = datetime.now().year

        # Filter expenses for the current month and year
        top_expenses = self.user.expenses.filter(date__month=current_month,
                                                 date__year=current_year) \
            .values('category__name') \
            .annotate(total=Sum('amount')) \
            .order_by('-total')[:4]

        # Calculate the total of the top expenses
        total_sum = top_expenses.aggregate(total_sum=Sum('total'))['total_sum'] or 0 # noqa

        # Format the response
        result = [{'category': expense['category__name'],
                   'total': expense['total']} for expense in top_expenses]

        return {'top_expenses': result, 'total': total_sum}


class IncomeCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class ExpenseCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Income(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
                             related_name='incomes')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(IncomeCategory, on_delete=models.SET_NULL,
                                 null=True, related_name='incomes')
    source = models.CharField(max_length=100)
    date = models.DateField()
    description = models.TextField(blank=True, null=True)
    transaction_type = models.CharField(max_length=20, default='income',
                                        null=True)

    def __str__(self):
        return str(self.amount)


class Expense(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
                             related_name='expenses')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(ExpenseCategory, on_delete=models.SET_NULL,
                                 null=True, related_name='expenses')
    date = models.DateField()
    description = models.TextField(blank=True, null=True)
    transaction_type = models.CharField(max_length=20, default='expense',
                                        null=True)

    def __str__(self):
        return str(self.amount)


class Message(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
                             related_name='messages')
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Message to {self.user.username}'


class Budget(models.Model):
    DURATION_CHOICES = [
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
                             related_name='budgets')
    name = models.CharField(max_length=255, null=True, blank=True, unique=True)
    target_amount = models.DecimalField(max_digits=10, decimal_places=2)
    spent_amount = models.DecimalField(max_digits=10, decimal_places=2,
                                       default=0)
    start_date = models.DateField(default=timezone.now().date())
    end_date = models.DateField(null=True, blank=True)
    duration = models.CharField(max_length=10, choices=DURATION_CHOICES,
                                default='monthly')
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if not self.end_date:
            if self.duration == 'weekly':
                self.end_date = self.start_date + timedelta(weeks=1) - timedelta(days=1) # noqa
            elif self.duration == 'monthly':
                self.end_date = (self.start_date + timedelta(days=31)).replace(day=1) - timedelta(days=1) # noqa
            elif self.duration == 'yearly':
                self.end_date = self.start_date.replace(year=self.start_date.year + 1) - timedelta(days=1) # noqa
        self.is_active = self.end_date >= timezone.now().date()
        super().save(*args, **kwargs)
        self.update_spent_amount()

    def update_spent_amount(self):
        total_spent = Expense.objects.filter(
            user=self.user,
            date__range=[self.start_date, self.end_date]
        ).aggregate(total=models.Sum('amount'))['total'] or 0
        self.spent_amount = total_spent
        super().save()
        self.check_and_send_alerts()

    @property
    def remaining_amount(self):
        return self.target_amount - self.spent_amount

    @property
    def spent_percentage(self):
        return (self.spent_amount / self.target_amount) * 100

    def __str__(self):
        return self.name or 'Unamed Budget'

    # Budget Alerts
    def create_budget_alert(self, percentage):
        content = f'Your {self.name} budget has reached {percentage}% of the limit.' # noqa
        Message.objects.create(user=self.user, content=content)

    def check_and_send_alerts(self):
        spent_percentage = self.spent_percentage
        if spent_percentage >= 100:
            self.create_budget_alert(100)
        elif spent_percentage >= 90:
            self.create_budget_alert(90)


class NetWorth(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE,
                             related_name='net_worths')
    date = models.DateField(auto_now_add=True)
    net_worth = models.DecimalField(max_digits=15, decimal_places=2)

    @classmethod
    def calculate_net_worth(cls, user):
        total_income = sum(income.amount for income in user.incomes.all())
        total_expenses = sum(expense.amount for expense in user.expenses.all())
        net_worth = total_income - total_expenses
        net_worth_record = cls.objects.create(user=user, net_worth=net_worth)
        return net_worth_record
