import React, { useState, useEffect } from "react";
import axios from 'axios';
import ModalBasic from "../components/ModalBasic";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { fetchUserProfile } from "./UserProfile";

export function AddRecord() {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("income");
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [incomeSource, setIncomeSource] = useState('');

  const [userId, setUserId] = useState('');


  // fetch user profile

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        setUserId(profile.user.id || '');
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    getUserProfile();
  }, []);

  console.log(userId)


  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('access_token');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const data = {
      amount,
      description,
      date: new Date().toISOString().split('T')[0],
      user: userId
    };

    if (transactionType === 'income') {
      data.category = { name: category }; // Match serializer structure
      data.source = incomeSource;

      await axios.post(`${backendUrl}/transactions/income/`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => {
          toast.success('Income recorded successfully');
        })
        .catch(error => {
          toast.error('There was an error recording the income!');
          console.log(error);
        });
    } else {
      data.category = { name: category }; // Match serializer structure

      await axios.post(`${backendUrl}/transactions/expense/`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => {
          toast.success('Expense recorded successfully');
        })
        .catch(error => {
          toast.error('There was an error recording the expense!');
          console.log(error);
        });
    }

    // Clear form fields after submission
    setAmount('');
    setDescription('');
    setCategory('');
    setIncomeSource('');
    setFeedbackModalOpen(false);

    // Refresh the page
    // window.location.reload();
  };

  return (
    <div className="m-1.5">
      <button
        className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
        aria-controls="feedback-modal"
        onClick={(e) => {
          e.stopPropagation();
          setFeedbackModalOpen(true);
        }}
      >
        <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
          <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
        </svg>
        <span className="hidden xs:block ml-2">Record</span>
      </button>
      <ModalBasic id="feedback-modal" modalOpen={feedbackModalOpen} setModalOpen={setFeedbackModalOpen} title="Add a Record">
        <form onSubmit={handleFormSubmit}>
          <div className="px-5 py-4">
            <div className="text-sm">
              <div className="font-medium text-slate-800 mb-3">Add A Record</div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="transactionType">Transaction Type <span className="text-rose-500">*</span></label>
                <select
                  id="transactionType"
                  className="form-select w-full"
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  required
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="amount">Amount <span className="text-rose-500">*</span></label>
                <input
                  id="amount"
                  className="form-input w-full px-2 py-1"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="category">Category <span className="text-rose-500">*</span></label>
                <select
                  id="category"
                  className="form-select w-full"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="salary">Salary</option>
                  <option value="freelance">Freelance</option>
                  <option value="investment">Investment</option>
                  <option value="grocery">Grocery</option>
                  <option value="bills">Bills</option>
                  <option value="entertainment">Entertainment</option>
                  {/* Add more options as needed */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="description">Description <span className="text-rose-500">*</span></label>
                <textarea
                  id="description"
                  className="form-textarea w-full px-2 py-1"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              {transactionType === 'income' && (
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="incomeSource">Source</label>
                  <input
                    id="incomeSource"
                    className="form-input w-full px-2 py-1"
                    type="text"
                    value={incomeSource}
                    onChange={(e) => setIncomeSource(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="px-5 py-4 border-t border-slate-200">
            <div className="flex flex-wrap justify-end space-x-2">
              <button className="btn-sm border-slate-200 hover:border-slate-300 text-slate-600" onClick={(e) => { e.stopPropagation(); setFeedbackModalOpen(false); }}>Cancel</button>
              <button type="submit" className="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white">Add</button>
            </div>
          </div>
        </form>
      </ModalBasic>
    </div>
  );
}
