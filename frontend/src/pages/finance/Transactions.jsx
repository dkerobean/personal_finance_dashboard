import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import DeleteButton from '../../partials/actions/DeleteButton';
import SearchForm from '../../partials/actions/SearchForm';
import DropdownTransaction from '../../components/DropdownTransaction';
import TransactionsTable from '../../partials/finance/TransactionsTable';
import PaginationClassic from '../../components/PaginationClassic';

import { useAuthCheck } from '../../utils/Auth';
import { fetchUserProfile } from '../../utils/UserProfile';
import axios from 'axios';
import { AddRecord } from '../../utils/AddRecord';

function Transactions() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [transactions, setTransactions] = useState({ incomes: [], expenses: [] });
  const [filterType, setFilterType] = useState('all');
  const [userProfile, setUserProfile] = useState(null);

  const loading = useAuthCheck();
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!loading) {
      fetchUserProfile()
        .then(profile => setUserProfile(profile))
        .catch(error => {
          toast.error("Failed to fetch user profile");
          console.log("Failed to fetch user profile:", error);
          navigate('/signin');
        });
    }
  }, [loading, navigate]);

  useEffect(() => {
    if (userProfile) {
      fetchTransactions(filterType);
    }
  }, [userProfile, filterType]);


  const fetchTransactions = async (type) => {
    try {
      const response = await axios.get(`${backendUrl}/transactions/all/`, {
        params: { type },
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      setTransactions(response.data);
    } catch (error) {
      console.log("Failed to fetch transactions:", error);
      toast.error("Failed to fetch transactions");
    }
  };

  const handleFilterClick = (type) => {
    setFilterType(type);
  };

  const handleSelectedItems = (selectedItems) => {
    setSelectedItems([...selectedItems]);
  };

  if (loading) {
    return null;
  }

  const currency = userProfile ? userProfile.currency_symbol : "$";

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-white">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center mb-4 md:mb-2">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">{currency}{userProfile ? userProfile.net_worth : '0.00'}</h1>
              </div>
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                <DeleteButton selectedItems={selectedItems} />
                <div className="hidden sm:block">
                  <SearchForm />
                </div>
                <div className="hidden sm:block ">
                  <AddRecord />
                </div>

                {/* <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">Export Transactions</button> */}
              </div>
            </div>
            <div className="mb-5">
              <span>Transactions from </span>
              <DropdownTransaction />
            </div>
            <div className="mb-5">
              <ul className="flex flex-wrap -m-1">
                <li className="m-1">
                  <button
                    className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border ${filterType === 'all' ? 'bg-indigo-500 text-white' : 'border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500'} duration-150 ease-in-out`}
                    onClick={() => handleFilterClick('all')}
                  >
                    View All
                  </button>
                </li>
                <li className="m-1">
                  <button
                    className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border ${filterType === 'income' ? 'bg-indigo-500 text-white' : 'border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500'} duration-150 ease-in-out`}
                    onClick={() => handleFilterClick('income')}
                  >
                    Income
                  </button>
                </li>
                <li className="m-1">
                  <button
                    className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border ${filterType === 'expense' ? 'bg-indigo-500 text-white' : 'border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500'} duration-150 ease-in-out`}
                    onClick={() => handleFilterClick('expense')}
                  >
                    Expense
                  </button>
                </li>
              </ul>
            </div>
            <TransactionsTable selectedItems={selectedItems} handleSelectedItems={handleSelectedItems} transactions={transactions} currency={currency} />
            <div className="mt-8">
              <PaginationClassic />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Transactions;

