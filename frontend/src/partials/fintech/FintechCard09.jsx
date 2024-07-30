import React, { useState, useEffect } from 'react';
import PieChart from '../../charts/PieChart';
import axios from 'axios';

// Import utilities
import { tailwindConfig } from '../../utils/Utils';

function FintechCard09( {currency} ) {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [total, setTotal] = useState(0);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchTopExpenses = async () => {
      try {
        const response = await axios.get(`${backendUrl}/transactions/top-expenses/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { top_expenses, total } = response.data;
        console.log(response.data);

        const labels = top_expenses.map(expense => expense.category);
        const amounts = top_expenses.map(expense => expense.total);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Top Expenses',
              data: amounts,
              backgroundColor: [
                tailwindConfig().theme.colors.emerald[400],
                tailwindConfig().theme.colors.amber[400],
                tailwindConfig().theme.colors.sky[400],
                tailwindConfig().theme.colors.indigo[500],
              ],
              hoverBackgroundColor: [
                tailwindConfig().theme.colors.emerald[500],
                tailwindConfig().theme.colors.amber[500],
                tailwindConfig().theme.colors.sky[500],
                tailwindConfig().theme.colors.indigo[600],
              ],
              borderWidth: 0,
            },
          ],
        });

        setTotal(total);
      } catch (error) {
        console.error('Error fetching top expenses:', error);
      }
    };

    fetchTopExpenses();
  }, [backendUrl, token]);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white shadow-lg rounded-sm border border-slate-200">
      <header className="px-5 py-4 border-b border-slate-100 flex items-center">
        <h2 className="font-semibold text-slate-800">Expense Structure</h2>
      </header>
      <div className="px-5 py-3">
        <div className="text-3xl font-bold text-slate-800">{currency}{total.toFixed(2)}</div>
      </div>
      <PieChart data={chartData} width={389} height={220} />
    </div>
  );
}

export default FintechCard09;
