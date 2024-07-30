import React, { useState, useEffect } from 'react';
import LineChart from '../../charts/LineChart05';
import axios from 'axios';

// Import utilities
import { tailwindConfig } from '../../utils/Utils';
import { hexToRGB } from '../../utils/Utils';

function FintechCard01() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        const endOfMonth = today.toISOString().split('T')[0];

        const response = await axios.get(`${backendUrl}/transactions/balance-trend/`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            start_date: startOfMonth,
            end_date: endOfMonth,
          }
        });

        const data = response.data;

        // Process data for daily intervals
        const labels = data.map(entry => entry.date); // Assume `date` field is in 'YYYY-MM-DD' format
        const balances = data.map(entry => entry.balance);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Balance',
              data: balances,
              borderColor: tailwindConfig().theme.colors.indigo[500],
              backgroundColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.indigo[500])}, 0.1)`,
              borderWidth: 2,
              tension: 0.1,
              pointRadius: 0,
              pointHoverRadius: 3,
              pointBackgroundColor: tailwindConfig().theme.colors.indigo[500],
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
    <div className="flex flex-col col-span-full xl:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200">
      <header className="px-5 py-4 border-b border-slate-100 flex items-center">
        <h2 className="font-semibold text-slate-800">Balance Trend</h2>
      </header>
      <LineChart data={chartData} width={800} height={300} />
    </div>
  );
}

export default FintechCard01;
