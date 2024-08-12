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

        setFinancialHealthScore(scoreData);
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

  return (
    <div className="flex h-screen overflow-hidden">
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
              <div className="max-w-2xl m-auto mt-16">

                {/* Financial Health Score */}
                <div className="text-center px-4 mb-8">
                  <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getHealthScoreColor(financialHealthScore)} mb-4`}>
                    <svg className="w-10 h-10 fill-current text-white" viewBox="0 0 24 24">
                      <path d="M12 4a8 8 0 11-8 8 8 8 0 018-8m0-2a10 10 0 1010 10A10 10 0 0012 2zm0 15a5 5 0 01-5-5h2a3 3 0 006 0h2a5 5 0 01-5 5z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl text-slate-800 font-bold mb-2">Financial Health Score</h2>
                  <div className="text-lg">{financialHealthScore ? `${(financialHealthScore * 100).toFixed(0)}%` : 'Loading...'}</div>
                </div>

                {/* Predictive Insights */}
                <div className="text-center px-4 mb-8">
                  <h2 className="text-2xl text-slate-800 font-bold mb-2">Predictive Insights</h2>
                  <div className="text-lg">{predictiveInsights ? predictiveInsights.summary : 'Loading...'}</div>
                </div>

                {/* Budget Recommendation */}
                <div className="text-center px-4 mb-8">
                  <h2 className="text-2xl text-slate-800 font-bold mb-2">Budget Recommendation</h2>
                  <div className="text-lg">{budgetRecommendation ? budgetRecommendation.recommendation : 'Loading...'}</div>
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
