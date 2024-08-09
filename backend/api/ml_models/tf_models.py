import tensorflow as tf
from tensorflow import keras
import numpy as np
from django.db.models import Sum, Avg
from django.utils import timezone
from datetime import datetime, timedelta
from user.models import CustomUser, Profile, Income, Expense, Budget


class FinancialHealthScoreModel:
    def __init__(self):
        self.model = keras.Sequential([
            keras.layers.Dense(128, activation='relu', input_shape=(6,)),
            keras.layers.Dense(64, activation='relu'),
            keras.layers.Dense(32, activation='relu'),
            keras.layers.Dense(1, activation='sigmoid')
        ])
        self.model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

    def train(self, users):
        X, y = [], []
        for user in users:
            try:
                features = self._extract_features(user)
                X.append(features)
                y.append(1 if self._is_financially_healthy(user) else 0)
            except Exception as e:
                print(f"Error processing user {user.id}: {str(e)}")

        X = np.array(X, dtype=np.float32)
        y = np.array(y, dtype=np.float32)

        self.model.fit(X, y, epochs=200, batch_size=32, validation_split=0.2, verbose=1)

    def predict_health_score(self, user):
        features = self._extract_features(user)
        return float(self.model.predict(np.array([features], dtype=np.float32))[0][0])

    def _extract_features(self, user):
        profile = user.profile
        income = float(self._get_average_monthly_income(user))
        expenses = float(self._get_average_monthly_expenses(user))
        savings_rate = (income - expenses) / income if income > 0 else 0
        net_worth = float(profile.net_worth)
        cash_flow = float(profile.cash_flow)
        total_spending = float(profile.total_spending)
        return [income, expenses, savings_rate, net_worth, cash_flow, total_spending]

    def _get_average_monthly_income(self, user):
        end_date = timezone.now()
        start_date = end_date - timedelta(days=365)
        avg_income = Income.objects.filter(user=user, date__range=[start_date, end_date]).aggregate(Avg('amount'))['amount__avg']
        return float(avg_income) if avg_income is not None else 0.0

    def _get_average_monthly_expenses(self, user):
        end_date = timezone.now()
        start_date = end_date - timedelta(days=365)
        avg_expenses = Expense.objects.filter(user=user, date__range=[start_date, end_date]).aggregate(Avg('amount'))['amount__avg']
        return float(avg_expenses) if avg_expenses is not None else 0.0

    def _is_financially_healthy(self, user):
        profile = user.profile
        income = self._get_average_monthly_income(user)
        expenses = self._get_average_monthly_expenses(user)
        savings_rate = (income - expenses) / income if income > 0 else 0
        return savings_rate > 0.2 and float(profile.cash_flow) > 0 and float(profile.net_worth) > 0


class SmartBudgetRecommendationModel:
    def __init__(self):
        self.model = keras.Sequential([
            keras.layers.Dense(128, activation='relu', input_shape=(6,)),
            keras.layers.Dense(64, activation='relu'),
            keras.layers.Dense(32, activation='relu'),
            keras.layers.Dense(1)
        ])
        self.model.compile(optimizer='adam', loss='mean_squared_error', metrics=['mae'])

    def train(self, users):
        X, y = [], []
        for user in users:
            try:
                features, target = self._prepare_data(user)
                X.extend(features)
                y.extend(target)
            except Exception as e:
                print(f"Error processing user {user.id}: {str(e)}")

        X = np.array(X)
        y = np.array(y)

        self.model.fit(X, y, epochs=200, batch_size=32, validation_split=0.2, verbose=1)

    def recommend_budget(self, user, expected_income):
        last_month_expense = self._get_last_month_expense(user)
        net_worth = float(user.profile.net_worth)
        cash_flow = float(user.profile.cash_flow)
        total_spending = float(user.profile.total_spending)
        active_budget = self._get_active_budget(user)

        # Debugging: print each feature to check their types
        print(f"expected_income: {expected_income}, type: {type(expected_income)}")
        print(f"last_month_expense: {last_month_expense}, type: {type(last_month_expense)}")
        print(f"net_worth: {net_worth}, type: {type(net_worth)}")
        print(f"cash_flow: {cash_flow}, type: {type(cash_flow)}")
        print(f"total_spending: {total_spending}, type: {type(total_spending)}")
        print(f"active_budget: {active_budget}, type: {type(active_budget)}")

        # Ensure all features are scalars
        X = np.array([[float(expected_income), float(last_month_expense), float(net_worth),
                    float(cash_flow), float(total_spending), float(active_budget)]])

        recommended_budget = self.model.predict(X)[0][0]

        return {
            'recommended_total_budget': recommended_budget,
            'current_active_budget': active_budget,
            'net_worth': net_worth,
            'cash_flow': cash_flow,
            'total_spending': total_spending,
        }

    def _prepare_data(self, user):
        end_date = timezone.now()
        start_date = end_date - timedelta(days=365)
        expenses = Expense.objects.filter(user=user, date__range=[start_date, end_date])
        incomes = Income.objects.filter(user=user, date__range=[start_date, end_date])

        monthly_expenses = self._aggregate_monthly(expenses)
        monthly_incomes = self._aggregate_monthly(incomes)

        features, target = [], []
        for month in monthly_expenses.keys():
            if month in monthly_incomes:
                last_month = month - timedelta(days=32)
                last_month_expense = monthly_expenses.get(last_month, 0)
                net_worth = float(user.profile.net_worth)
                cash_flow = float(user.profile.cash_flow)
                total_spending = float(user.profile.total_spending)
                active_budget = self._get_active_budget(user)

                features.append([
                    monthly_incomes[month],
                    last_month_expense,
                    net_worth,
                    cash_flow,
                    total_spending,
                    active_budget
                ])
                target.append(monthly_expenses[month])

        return features, target

    def _aggregate_monthly(self, transactions):
        monthly = {}
        for trans in transactions:
            month = trans.date.replace(day=1)
            monthly[month] = monthly.get(month, 0) + trans.amount
        return monthly

    def _get_last_month_expense(self, user):
        last_month = timezone.now().replace(day=1) - timedelta(days=1)
        return Expense.objects.filter(user=user, date__month=last_month.month, date__year=last_month.year).aggregate(Sum('amount'))['amount__sum'] or 0

    def _get_active_budget(self, user):
        active_budget = Budget.objects.filter(user=user, is_active=True).first()
        return float(active_budget.target_amount) if active_budget else 0


class PredictiveInsightsModel:
    def __init__(self):
        self.model = keras.Sequential([
            keras.layers.LSTM(64, input_shape=(30, 1), return_sequences=True),
            keras.layers.LSTM(32),
            keras.layers.Dense(16, activation='relu'),
            keras.layers.Dense(1)
        ])
        self.model.compile(optimizer='adam', loss='mean_squared_error', metrics=['mae'])

    def train(self, users):
        X, y = [], []
        for user in users:
            try:
                user_X, user_y = self._prepare_data(user)
                X.extend(user_X)
                y.extend(user_y)
            except Exception as e:
                print(f"Error processing user {user.id}: {str(e)}")

        X = np.array(X)
        y = np.array(y)

        self.model.fit(X, y, epochs=200, batch_size=32, validation_split=0.2, verbose=1)

    def predict(self, user):
        expenses = self._get_recent_expenses(user)
        if len(expenses) < 30:
            raise ValueError(f"Not enough data for prediction. Need at least 30 days, but got {len(expenses)} days.")

        X = np.array(expenses[-30:]).reshape(1, 30, 1)
        prediction = self.model.predict(X)[0][0]

        return {
            'predicted_expense': prediction,
            'confidence_interval': self._calculate_confidence_interval(user, prediction)
        }

    def _prepare_data(self, user):
        expenses = self._get_recent_expenses(user)
        X, y = [], []
        for i in range(len(expenses) - 30):
            X.append(expenses[i:i+30])
            y.append(expenses[i+30])
        return np.array(X), np.array(y)

    def _get_recent_expenses(self, user):
        end_date = timezone.now()
        start_date = end_date - timedelta(days=365)
        expenses = Expense.objects.filter(user=user, date__range=[start_date, end_date]).order_by('date')
        return [float(expense.amount) for expense in expenses]

    def _calculate_confidence_interval(self, user, prediction):
        recent_expenses = self._get_recent_expenses(user)[-30:]
        std_dev = np.std(recent_expenses)
        return (prediction - 2*std_dev, prediction + 2*std_dev)