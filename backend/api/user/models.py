from django.db import models
from django.contrib.auth.models import (AbstractBaseUser,
                                        PermissionsMixin,
                                        BaseUserManager)
import uuid


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
    profile_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255)
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    currency_symbol = models.CharField(max_length=5, default='₵', null=True,
                                       blank=True)

    def __str__(self):
        return self.user.username


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
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='incomes')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(IncomeCategory, on_delete=models.SET_NULL, null=True, related_name='incomes')
    source = models.CharField(max_length=100)
    date = models.DateField()
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return str(self.amount)


class Expense(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='expenses')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(ExpenseCategory, on_delete=models.SET_NULL, null=True, related_name='expenses')
    date = models.DateField()
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return str(self.amount)


class Budget(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='budgets')
    category = models.ForeignKey(ExpenseCategory, on_delete=models.SET_NULL, null=True, related_name='budgets')
    target_amount = models.DecimalField(max_digits=10, decimal_places=2)
    spent_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    start_date = models.DateField()
    end_date = models.DateField()

    @property
    def remaining_amount(self):
        return self.target_amount - self.spent_amount


class NetWorth(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='net_worths')
    date = models.DateField(auto_now_add=True)
    net_worth = models.DecimalField(max_digits=15, decimal_places=2)

    @classmethod
    def calculate_net_worth(cls, user):
        total_income = sum(income.amount for income in user.incomes.all())
        total_expenses = sum(expense.amount for expense in user.expenses.all())
        net_worth = total_income - total_expenses
        net_worth_record = cls.objects.create(user=user, net_worth=net_worth)
        return net_worth_record

