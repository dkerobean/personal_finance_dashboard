import React, { useState, useEffect } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Predictions() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [financialHealthScore, setFinancialHealthScore] = useState(null);
  const [predictiveInsights, setPredictiveInsights] = useState(null);
  const [budgetRecommendation, setBudgetRecommendation] = useState(null);

  const token = localStorage.getItem('access_token'); // Get token from local storage

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const [scoreResponse, insightsResponse, recommendationResponse] = await Promise.all([
          fetch(`${backendUrl}/ai/financial-health-score/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${backendUrl}/ai/predictive-insights/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${backendUrl}/ai/budget-recommendation/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        const [scoreData, insightsData, recommendationData] = await Promise.all([
          scoreResponse.json(),
          insightsResponse.json(),
          recommendationResponse.json()
        ]);

        setFinancialHealthScore(scoreData.financial_health_score);
        setPredictiveInsights(insightsData);
        setBudgetRecommendation(recommendationData);
      } catch (error) {
        console.error('Error fetching AI predictions:', error);
      }
    };

    fetchPredictions();
  }, [token]);

  const getHealthScoreColor = (score) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const renderConfidenceInterval = (interval) => {
    const [lower, upper] = interval;
    return (
      <div className="mt-4">
        <p className="text-sm text-slate-600">We are confident that your total expenses will be between:</p>
        <div className="flex justify-between mt-2">
          <span className="text-lg font-medium text-red-500">${lower.toFixed(2)}</span>
          <span className="text-lg font-medium text-green-500">${upper.toFixed(2)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-white">
        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Page header */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">AI Predictions</h1>
              </div>
            </div>

            <div className="border-t border-slate-200">
              <div className="max-w-3xl mx-auto mt-16 space-y-12">

                {/* Financial Health Score */}
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getHealthScoreColor(financialHealthScore)} mb-4`}>
                    <svg className="w-10 h-10 fill-current text-white" viewBox="0 0 24 24">
                      <path d="M12 4a8 8 0 11-8 8 8 8 0 018-8m0-2a10 10 0 1010 10A10 10 0 0012 2zm0 15a5 5 0 01-5-5h2a3 3 0 006 0h2a5 5 0 01-5 5z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl text-slate-800 font-bold mb-2">Financial Health Score</h2>
                  <p className="text-lg text-gray-700">
                    {financialHealthScore !== null ? `${(financialHealthScore * 100).toFixed(0)}%` : 'Loading...'}
                  </p>
                </div>

                {/* Predictive Insights */}
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <h2 className="text-2xl text-slate-800 font-bold mb-4">Predictive Insights</h2>
                  <p className="text-lg text-gray-700">
                    {predictiveInsights ? (
                      <>
                        <p><strong>Predicted Total Expense:</strong> ${predictiveInsights.predicted_total_expense.toFixed(2)}</p>
                        {renderConfidenceInterval(predictiveInsights.confidence_interval)}
                      </>
                    ) : 'Loading...'}
                  </p>
                </div>

                {/* Budget Recommendation */}
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <h2 className="text-2xl text-slate-800 font-bold mb-4">Budget Recommendation</h2>
                  <p className="text-lg text-gray-700">
                    {budgetRecommendation ? (
                      <>
                        <p><strong>Recommended Total Budget:</strong> ${budgetRecommendation.recommended_total_budget.toFixed(2)}</p>
                        <p><strong>Total Spending:</strong> ${budgetRecommendation.total_spending.toFixed(2)}</p>
                        <p><strong>Expected Income:</strong> ${budgetRecommendation.expected_income.toFixed(2)}</p>
                      </>
                    ) : 'Loading...'}
                  </p>
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Predictions;
