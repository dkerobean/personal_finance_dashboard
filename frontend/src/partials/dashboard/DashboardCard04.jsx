import React, { useEffect, useState } from 'react';
import BarChart from '../../charts/BarChart01';
import axios from 'axios';

// Import utilities
import { tailwindConfig } from '../../utils/Utils';

// Mapping numerical month to short month name
const monthMap = {
  1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
  7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'
};

function DashboardCard04() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [currentMonthData, setCurrentMonthData] = useState({ income: 0, expenses: 0 });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/transactions/cashflow/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = response.data;

        // Get current month as a number (1 for January, 2 for February, etc.)
        const today = new Date();
        const currentMonth = today.getMonth() + 1; // JavaScript months are 0-based

        // Convert numerical months to short forms
        const labels = data.labels.map(month => monthMap[month]);

        // Create a new order for labels and data
        const orderedLabels = [...labels];
        const orderedIncome = [...data.income];
        const orderedExpenses = [...data.expenses];

        // Move current month to the last
        const currentMonthIndex = data.labels.indexOf(currentMonth);
        if (currentMonthIndex !== -1) {
          orderedLabels.push(orderedLabels.splice(currentMonthIndex, 1)[0]);
          orderedIncome.push(orderedIncome.splice(currentMonthIndex, 1)[0]);
          orderedExpenses.push(orderedExpenses.splice(currentMonthIndex, 1)[0]);
        }

        setCurrentMonthData({
          income: data.income[currentMonthIndex] || 0,
          expenses: data.expenses[currentMonthIndex] || 0
        });

        setChartData({
          labels: orderedLabels,
          datasets: [
            {
              label: 'Income',
              data: orderedIncome,
              backgroundColor: tailwindConfig().theme.colors.green[400],
              hoverBackgroundColor: tailwindConfig().theme.colors.green[500],
              barPercentage: 0.66,
              categoryPercentage: 0.66,
            },
            {
              label: 'Expenses',
              data: orderedExpenses,
              backgroundColor: tailwindConfig().theme.colors.red[400],
              hoverBackgroundColor: tailwindConfig().theme.colors.red[500],
              barPercentage: 0.66,
              categoryPercentage: 0.66,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [backendUrl, token]);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200">
      <header className="px-5 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800">Cashflow</h2>
      </header>
      <BarChart data={chartData} width={595} height={248} />
      <div className="px-5 py-4 bg-gray-50 border-t border-slate-200">
        <div className="flex justify-between items-center text-sm text-slate-600">
          <div className="flex items-center space-x-2">
            <span className="block w-3 h-3 rounded-full border-3 border-green-400"></span>
            <span>Income: {currentMonthData.income}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="block w-3 h-3 rounded-full border-3 border-red-400"></span>
            <span>Expenses: {currentMonthData.expenses}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard04;
