import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DashboardCard11() {
  const [transactions, setTransactions] = useState([]);

  const token = localStorage.getItem('access_token');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${backendUrl}/transactions/all/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const allTransactions = [...response.data.incomes, ...response.data.expenses];
        allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(allTransactions.slice(0, 6));
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="col-span-full xl:col-span-8 bg-white shadow-lg rounded-sm border border-slate-200">
      <header className="px-5 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800">Last Records</h2>
      </header>
      <div className="p-3">
        {/* Card content */}
        <div>
          <ul className="my-1">
            {transactions.map(transaction => {
              const isIncome = transaction.transaction_type === 'income';
              const amountColor = isIncome ? 'text-emerald-500' : 'text-rose-500';
              const bgColor = isIncome ? 'bg-emerald-500' : 'bg-rose-500';
              const amountPrefix = isIncome ? '+' : '-';
              const svgPath = isIncome
                ? 'M18.3 11.3l-1.4 1.4 4.3 4.3H11v2h10.2l-4.3 4.3 1.4 1.4L25 18z'
                : 'M17.7 24.7l1.4-1.4-4.3-4.3H25v-2H14.8l4.3-4.3-1.4-1.4L11 18z';

              return (
                <li key={transaction.id} className="flex px-2">
                  <div className={`w-9 h-9 rounded-full shrink-0 ${bgColor} my-2 mr-3`}>
                    <svg className="w-9 h-9 fill-current text-rose-50" viewBox="0 0 36 36">
                      <path d={svgPath} />
                    </svg>
                  </div>
                  <div className="grow flex items-center border-b border-slate-100 text-sm py-2">
                    <div className="grow flex justify-between">
                      <div className="self-center">
                        <a className="font-medium text-slate-800 hover:text-slate-900" href="#0">
                          {/* {transaction.source} */}
                        </a>{' '}
                        {transaction.category.name}
                      </div>
                      <div className="shrink-0 self-start ml-2">
                        <span className={`font-medium ${amountColor}`}>
                          {amountPrefix}${transaction.amount}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard11;
