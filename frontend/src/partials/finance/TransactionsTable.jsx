import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import TransactionsTableItem from './TransactionsTableItem';
import EditRecord from '../../utils/EditRecord';
import ConfirmationModal from '../../utils/ConfirmModal';

function TransactionsTable({ transactions, currency, fetchTransactions }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false); // State for confirmation modal

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('access_token');

  const handleSelectedItems = (id) => {
    setSelectedItems((prevSelectedItems) => {
      const newSelectedItems = prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((item) => item !== id)
        : [...prevSelectedItems, id];

      setShowOptions(newSelectedItems.length > 0);
      setShowUpdate(newSelectedItems.length === 1);

      return newSelectedItems;
    });
  };

  const handleDelete = async () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      for (const id of selectedItems) {
        const transaction = allTransactions.find((t) => t.id === id);
        const url = transaction.transaction_type === 'income'
          ? `${backendUrl}/transactions/income/${id}/`
          : `${backendUrl}/transactions/expense/${id}/`;

        await axios.delete(url, { headers });
        fetchTransactions();
      }

      toast.success('Transactions deleted successfully');
    } catch (error) {
      toast.error('Failed to delete transactions');
    }

    setSelectedItems([]);
    setShowOptions(false);
    setShowUpdate(false);
    setConfirmDeleteModalOpen(false); // Close the modal after deletion
  };

  const handleUpdate = async () => {
    const transactionId = selectedItems[0];
    const transactionType = allTransactions.find(t => t.id === transactionId).transaction_type;
    const url = transactionType === 'income'
      ? `${backendUrl}/transactions/income/detail/${transactionId}/`
      : `${backendUrl}/transactions/expense/detail/${transactionId}/`;

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingTransaction(response.data);
      setEditModalOpen(true);
    } catch (error) {
      toast.error('Failed to fetch transaction details');
    }
  };

  const { incomes, expenses } = transactions;
  const allTransactions = [...incomes, ...expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Group transactions by date
  const groupedTransactions = allTransactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

  return (
    <div className="bg-white shadow-md rounded my-6">
      <div className="flex justify-end mb-4">
        {showOptions && (
          <>
            {showUpdate && (
              <button
                className="btn bg-blue-500 hover:bg-blue-600 text-white mr-2"
                onClick={handleUpdate}
              >
                Update
              </button>
            )}
            <button
              className="btn bg-red-500 hover:bg-red-600 text-white"
              onClick={() => setConfirmDeleteModalOpen(true)} // Open modal for confirmation
            >
              Delete
            </button>
          </>
        )}
      </div>
      <table className="min-w-max w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Date</th>
            <th className="py-3 px-6 text-left">Type</th>
            <th className="py-3 px-6 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {Object.keys(groupedTransactions).map((date) => (
            <React.Fragment key={date}>
              <tr>
                <td
                  colSpan="4"
                  className="bg-gray-100 text-gray-800 text-sm font-semibold py-2 px-4"
                >
                  {date}
                </td>
              </tr>
              {groupedTransactions[date].map((transaction) => {
                const formattedDate = new Intl.DateTimeFormat('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }).format(new Date(transaction.date));

                return (
                  <TransactionsTableItem
                    key={transaction.id}
                    id={transaction.id}
                    name={transaction.category.name || 'No Name'}
                    date={formattedDate}
                    status={transaction.transaction_type || 'No Category'}
                    amount={`${
                      transaction.transaction_type === 'income' ? '+' : '-'
                    }${currency}${transaction.amount}`}
                    handleClick={handleSelectedItems}
                    isChecked={selectedItems.includes(transaction.id)}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {editingTransaction && (
        <EditRecord
          transaction={editingTransaction}
          modalOpen={editModalOpen}
          setModalOpen={setEditModalOpen}
          fetchTransactions={fetchTransactions}
        />
      )}
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmDeleteModalOpen}
        onClose={() => setConfirmDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default TransactionsTable;
