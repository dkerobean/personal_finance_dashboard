import tensorflow as tf
from tensorflow import keras
import numpy as np
from user.models import Expense, Income
from datetime import datetime, timedelta


class ExpensePredictionModel:
    def __init__(self):
        self.model = keras.Sequential([
            keras.layers.LSTM(64, input_shape=(30, 1), return_sequences=True),
            keras.layers.LSTM(32),
            keras.layers.Dense(1)
        ])
        self.model.compile(optimizer='adam', loss='mse')

    def train(self, user):
        end_date = datetime.now()
        start_date = Expense.objects.filter(user=user).earliest('date').date

        expenses = Expense.objects.filter(user=user, date__range=[start_date, end_date]).order_by('date')
        amounts = [float(expense.amount) for expense in expenses]

        if len(amounts) < 29:
            raise ValueError(f"Not enough data for training. Need at least 29 days, but got {len(amounts)} days.")

        # Pad or truncate to 30 days
        amounts = amounts[:30] + [0] * (30 - len(amounts))

        X = np.array(amounts[:-1]).reshape(1, 29, 1)
        y = np.array(amounts[-1])

        self.model.fit(X, y, epochs=100, verbose=0)

    def predict(self, user):
        end_date = datetime.now()
        start_date = Expense.objects.filter(user=user).earliest('date').date

        expenses = Expense.objects.filter(user=user, date__range=[start_date, end_date]).order_by('date')
        amounts = [float(expense.amount) for expense in expenses]

        if len(amounts) < 29:
            raise ValueError(f"Not enough data for prediction. Need at least 29 days, but got {len(amounts)} days.")

        # Pad or truncate to 29 days
        amounts = amounts[:29] + [0] * (29 - len(amounts))

        # Debugging print statements
        print("Amounts:", amounts)
        reshaped_amounts = np.array(amounts).reshape(1, 29, 1)
        print("Reshaped amounts shape:", reshaped_amounts.shape)

        prediction = self.model.predict(reshaped_amounts)

        # Debugging print statements
        print("Prediction:", prediction)

        return prediction


class FinancialHealthScoreModel:
    def __init__(self):
        self.model = keras.Sequential([
            keras.layers.Dense(64, activation='relu', input_shape=(5,)),
            keras.layers.Dense(32, activation='relu'),
            keras.layers.Dense(1, activation='sigmoid')
        ])
        self.model.compile(optimizer='adam', loss='binary_crossentropy')

    def train(self, users):
        X, y = [], []
        for user in users:
            features = self._extract_features(user)
            X.append(features)
            y.append(user.is_financially_healthy)  # You'd need to define this attribute

        self.model.fit(np.array(X), np.array(y), epochs=100, verbose=0)

    def predict_health_score(self, user):
        features = self._extract_features(user)
        return self.model.predict(np.array([features]))[0][0]

    def _extract_features(self, user):
        income = self._get_average_monthly_income(user)
        expenses = self._get_average_monthly_expenses(user)
        savings_rate = (income - expenses) / income if income > 0 else 0
        debt_to_income = self._get_debt_to_income_ratio(user)
        emergency_fund = self._get_emergency_fund_ratio(user)
        return [income, expenses, savings_rate, debt_to_income, emergency_fund]

    def _get_average_monthly_income(self, user):
        end_date = datetime.now()
        start_date = Income.objects.filter(user=user).earliest('date').date
        incomes = Income.objects.filter(user=user, date__range=[start_date, end_date])
        total_income = sum(float(income.amount) for income in incomes)
        num_months = (end_date.year - start_date.year) * 12 + end_date.month - start_date.month + 1
        return total_income / num_months

    def _get_average_monthly_expenses(self, user):
        end_date = datetime.now()
        start_date = Expense.objects.filter(user=user).earliest('date').date
        expenses = Expense.objects.filter(user=user, date__range=[start_date, end_date])
        total_expenses = sum(float(expense.amount) for expense in expenses)
        num_months = (end_date.year - start_date.year) * 12 + end_date.month - start_date.month + 1
        return total_expenses / num_months

    def _get_debt_to_income_ratio(self, user):
        total_debt = sum(float(debt.amount) for debt in Debt.objects.filter(user=user))
        average_income = self._get_average_monthly_income(user)
        return total_debt / average_income if average_income > 0 else 0


class SmartBudgetRecommendationModel:
    def __init__(self):
        self.model = keras.Sequential([
            keras.layers.Dense(64, activation='relu', input_shape=(input_dim,)),  # Define input_dim appropriately
            keras.layers.Dense(32, activation='relu'),
            keras.layers.Dense(1)  # Single output for regression
        ])
        self.model.compile(optimizer='adam', loss='mean_squared_error')

    def train(self, user):
        end_date = datetime.now()
        start_date = end_date - timedelta(days=365)
        expenses = Expense.objects.filter(user=user, date__range=[start_date, end_date])
        incomes = Income.objects.filter(user=user, date__range=[start_date, end_date])

        monthly_expenses = self._aggregate_monthly(expenses)
        monthly_incomes = self._aggregate_monthly(incomes)

        X, y = [], []
        for month in monthly_expenses.keys():
            if month in monthly_incomes:
                X.append([monthly_incomes[month], monthly_expenses[month], user.profile.risk_tolerance])
                y.append(monthly_expenses[month])

        self.model.fit(np.array(X), np.array(y), epochs=100, verbose=0)

    def recommend_budget(self, user, expected_income):
        last_month_expense = self._get_last_month_expense(user)
        X = np.array([[expected_income, last_month_expense, user.profile.risk_tolerance]])
        return self.model.predict(X)[0][0]

    def _aggregate_monthly(self, transactions):
        monthly = {}
        for trans in transactions:
            month = trans.date.replace(day=1)
            monthly[month] = monthly.get(month, 0) + float(trans.amount)
        return monthly

    def _get_last_month_expense(self, user):
        last_month = datetime.now().replace(day=1) - timedelta(days=1)
        expenses = Expense.objects.filter(user=user, date__month=last_month.month, date__year=last_month.year)
        return sum(float(expense.amount) for expense in expenses)


class ExpenseCategorizationModel:
    def __init__(self, num_categories):
        self.model = keras.Sequential([
            keras.layers.Dense(64, activation='relu', input_shape=(input_dim,)),  # Define input_dim appropriately
            keras.layers.Dense(32, activation='relu'),
            keras.layers.Dense(num_categories, activation='softmax')  # Output layer with num_categories units
        ])
        self.model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

    def train(self, user):
        expenses = Expense.objects.filter(user=user)
        descriptions = [expense.description for expense in expenses]
        categories = [expense.category_id for expense in expenses]

        # Preprocess descriptions and categories
        tokenizer = keras.preprocessing.text.Tokenizer(num_words=10000)
        tokenizer.fit_on_texts(descriptions)
        sequences = tokenizer.texts_to_sequences(descriptions)
        X = keras.preprocessing.sequence.pad_sequences(sequences, maxlen=100)
        y = np.array(categories)

        self.model.fit(X, y, epochs=10, verbose=0)

    def categorize(self, description):
        tokenizer = keras.preprocessing.text.Tokenizer(num_words=10000)
        sequence = tokenizer.texts_to_sequences([description])
        X = keras.preprocessing.sequence.pad_sequences(sequence, maxlen=100)


class PredictiveInsightsModel:
    def __init__(self):
        self.model = keras.Sequential([
            keras.layers.Dense(64, activation='relu', input_shape=(input_dim,)),  # Define input_dim appropriately
            keras.layers.Dense(32, activation='relu'),
            keras.layers.Dense(1)  # Single output for regression
        ])
        self.model.compile(optimizer='adam', loss='mean_squared_error')

    def train(self, user):
        end_date = datetime.now()
        start_date = Expense.objects.filter(user=user).earliest('date').date
        expenses = Expense.objects.filter(user=user, date__range=[start_date, end_date]).order_by('date')
        amounts = [float(expense.amount) for expense in expenses]

        if len(amounts) < 29:
            raise ValueError(f"Not enough data for training. Need at least 29 days, but got {len(amounts)} days.")

        amounts = amounts[:30] + [0] * (30 - len(amounts))
        X = np.array(amounts[:-1]).reshape(1, 29, 1)
        y = np.array(amounts[-1])

        self.model.fit(X, y, epochs=100, verbose=0)

    def predict(self, user):
        end_date = datetime.now()
        start_date = Expense.objects.filter(user=user).earliest('date').date
        expenses = Expense.objects.filter(user=user, date__range=[start_date, end_date]).order_by('date')
        amounts = [float(expense.amount) for expense in expenses]

        if len(amounts) < 29:
            raise ValueError(f"Not enough data for prediction. Need at least 29 days, but got {len(amounts)} days.")

        amounts = amounts[:29] + [0] * (29 - len(amounts))
        prediction = self.model.predict(np.array(amounts).reshape(1, 29, 1))
        return prediction