import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { fetchUserProfile } from './UserProfile';

export function EditBudgetModal({ budget, isOpen, onClose, fetchBudgets }) {
  const [name, setName] = useState(budget.name || '');
  const [targetAmount, setTargetAmount] = useState(budget.target_amount || '');
  const [isActive, setIsActive] = useState(budget.is_active || false);
  const [userId, setUserId] = useState('');


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

  console.log(userId);

  if (!isOpen) return null;


  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('access_token');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      const response = await fetch(`${backendUrl}/budget/edit/${budget.id}/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          target_amount: targetAmount,
          is_active: isActive,
          user: userId
        }),
      });

      if (response.ok) {
        toast.success('Budget updated successfully!');
        onClose();
        fetchBudgets();
      } else {
        const errorText = await response.text();
        console.error('Response text:', errorText);

        const errorData = JSON.parse(errorText);
        toast.error(`Error: ${errorData.detail || 'Failed to update budget.'}`);
      }
    } catch (error) {
      console.error('Error updating budget:', error);
      toast.error('Error updating budget.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">Edit Budget</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Budget Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-slate-300 p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Target Amount</label>
            <input
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="border border-slate-300 p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="mr-2"
              />
              <span>Active</span>
            </label>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
