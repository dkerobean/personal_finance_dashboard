
import tensorflow as tf
from tensorflow import keras
import numpy as np
from user.models import Expense, NetWorth, Income


class ExpensePredictionModel:
    def __init__(self):
        self.model = keras.Sequential([
            keras.layers.LSTM(64, input_shape=(None, 1)),
            keras.layers.Dense(1)
        ])
        self.model.compile(optimizer='adam', loss='mse')

    def train(self, user):
        expenses = Expense.objects.filter(user=user).order_by('date')
        amounts = [float(expense.amount) for expense in expenses]

        X = np.array(amounts[:-1]).reshape(-1, 1, 1)
        y = np.array(amounts[1:])

        self.model.fit(X, y, epochs=100, verbose=0)

    def predict(self, last_amount):
        return self.model.predict(np.array([[last_amount]]))


class AnomalyDetectionModel:
    def __init__(self):
        self.model = keras.Sequential([
            keras.layers.Dense(64, activation='relu', input_shape=(1,)),
            keras.layers.Dense(32, activation='relu'),
            keras.layers.Dense(1, activation='sigmoid')
        ])
        self.model.compile(optimizer='adam', loss='binary_crossentropy')

    def train(self, user):
        expenses = Expense.objects.filter(user=user)
        amounts = np.array([float(expense.amount) for expense in expenses])

        self.model.fit(amounts, np.zeros_like(amounts), epochs=50, verbose=0)

    def detect_anomalies(self, amounts):
        anomaly_scores = self.model.predict(amounts)
        return amounts[anomaly_scores > 0.5]


class NetWorthForecastingModel:
    def __init__(self):
        self.model = tf.keras.Sequential([
            tf.keras.layers.LSTM(50, activation='relu', input_shape=(None, 1)),
            tf.keras.layers.Dense(1)
        ])
        self.model.compile(optimizer='adam', loss='mse')

    def train(self, user):
        net_worth_history = NetWorth.objects.filter(user=user).order_by('date')
        net_worth_values = [float(nw.net_worth) for nw in net_worth_history]

        X = np.array(net_worth_values[:-1]).reshape(-1, 1, 1)
        y = np.array(net_worth_values[1:])

        self.model.fit(X, y, epochs=100, verbose=0)

    def forecast(self, user, periods=12):
        net_worth_history = NetWorth.objects.filter(user=user).order_by('date')
        last_net_worth = float(net_worth_history.last().net_worth)

        forecasts = []
        current_value = last_net_worth

        for _ in range(periods):
            next_value = self.model.predict(np.array([[current_value]]))
            forecasts.append(float(next_value[0][0]))
            current_value = next_value[0][0]

        return forecasts


class IncomeTrendAnalysisModel:
    def __init__(self):
        self.model = keras.Sequential([
            keras.layers.LSTM(64, input_shape=(None, 1)),
            keras.layers.Dense(1)
        ])
        self.model.compile(optimizer='adam', loss='mse')

    def train(self, user):
        incomes = Income.objects.filter(user=user).order_by('date')
        amounts = [float(income.amount) for income in incomes]

        X = np.array(amounts[:-1]).reshape(-1, 1, 1)
        y = np.array(amounts[1:])

        self.model.fit(X, y, epochs=100, verbose=0)

    def predict(self, last_amount):
        return self.model.predict(np.array([[last_amount]]))