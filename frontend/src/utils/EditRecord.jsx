import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalBasic from '../components/ModalBasic';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditRecord({ transaction, modalOpen, setModalOpen, fetchTransactions }) {
  const [transactionType, setTransactionType] = useState(transaction.transaction_type);
  const [amount, setAmount] = useState(transaction.amount);
  const [description, setDescription] = useState(transaction.description);
  const [category, setCategory] = useState(transaction.category.name);
  const [incomeSource, setIncomeSource] = useState(transaction.source || '');
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [incomeResponse, expenseResponse] = await Promise.all([
          axios.get(`${backendUrl}/transactions/income/category/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendUrl}/transactions/expense/category/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setIncomeCategories(incomeResponse.data);
        setExpenseCategories(expenseResponse.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [backendUrl, token]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const data = {
      amount,
      description,
      date: transaction.date,
      user: transaction.user,
      category: { name: category },
      source: transactionType === 'income' ? incomeSource : undefined,
    };

    try {
      const url =
        transactionType === 'income'
          ? `${backendUrl}/transactions/income/${transaction.id}/`
          : `${backendUrl}/transactions/expense/${transaction.id}/`;
      await axios.put(url, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Transaction updated successfully');
      fetchTransactions();
      setModalOpen(false);
    } catch (error) {
      toast.error('There was an error updating the transaction!');
      console.error(error);
    }
  };

  return (
    <ModalBasic id="edit-modal" modalOpen={modalOpen} setModalOpen={setModalOpen} title="Edit Record">
      <form onSubmit={handleFormSubmit}>
        <div className="px-5 py-4">
          <div className="text-sm">
            <div className="font-medium text-slate-800 mb-3">Edit Record</div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="transactionType">
                Transaction Type <span className="text-rose-500">*</span>
              </label>
              <select
                id="transactionType"
                className="form-select w-full"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                required
                disabled
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="amount">
                Amount <span className="text-rose-500">*</span>
              </label>
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
              <label className="block text-sm font-medium mb-1" htmlFor="category">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="category"
                className="form-select w-full"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {transactionType === 'income' &&
                  incomeCategories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                {transactionType === 'expense' &&
                  expenseCategories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="description">
                Description <span className="text-rose-500">*</span>
              </label>
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
                <label className="block text-sm font-medium mb-1" htmlFor="incomeSource">
                  Source
                </label>
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
            <button
              className="btn-sm border-slate-200 hover:border-slate-300 text-slate-600"
              onClick={(e) => {
                e.stopPropagation();
                setModalOpen(false);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white">
              Update
            </button>
          </div>
        </div>
      </form>
    </ModalBasic>
  );
}

export default EditRecord;