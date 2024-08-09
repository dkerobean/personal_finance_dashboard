import React, { useState, useEffect } from 'react';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';

import { AddBudget } from '../../utils/AddBudget';
import { EditBudgetModal } from '../../utils/EditBudget';
import ConfirmationModal from '../../utils/ConfirmModal';

function Budgets() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false); // State for confirmation modal

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchBudgets = async () => {
    const accessToken = localStorage.getItem('access_token');
    try {
      const response = await fetch(`${backendUrl}/budget/all/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      setBudgets(data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleDelete = async () => {
    if (!selectedBudget) return;

    const accessToken = localStorage.getItem('access_token');

    try {
      await fetch(`${backendUrl}/budget/edit/${selectedBudget.id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      // Remove the deleted budget from state
      setBudgets(budgets.filter(budget => budget.id !== selectedBudget.id));
      setSelectedBudget(null);
      setConfirmDeleteModalOpen(false); // Close the modal after deletion
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
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
          <div className="lg:relative lg:flex">
            {/* Content */}
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              {/* Page header */}
              <div className="sm:flex sm:justify-between sm:items-center mb-5">
                {/* Left: Title */}
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">Budgets ✨</h1>
                </div>

                {/* Add budget button */}
                <AddBudget fetchBudgets={fetchBudgets}/>
              </div>

              {/* Budgets */}
              <div className="space-y-2">
                {budgets.map((budget) => (
                  <label
                    key={budget.id}
                    className="relative block cursor-pointer text-left w-full"
                    onClick={() => setSelectedBudget(budget)}
                  >
                    <div className="p-4 rounded border border-slate-200 hover:border-slate-300 shadow-sm duration-150 ease-in-out">
                      <div className="grid grid-cols-12 items-center gap-x-2">
                        {/* Budget Name */}
                        <div className="col-span-6 order-2 sm:order-none sm:col-span-3 text-left sm:text-center lg:sidebar-expanded:hidden xl:sidebar-expanded:block">
                          <div className="text-sm font-medium text-slate-800 truncate">{budget.name}</div>
                        </div>
                        {/* Budget amounts */}
                        <div className="col-span-6 order-1 sm:order-none sm:col-span-4 text-right sm:text-center lg:sidebar-expanded:col-span-6 xl:sidebar-expanded:col-span-4">
                          <div className="text-sm">${budget.spent_amount} / ${budget.target_amount}</div>
                        </div>
                        {/* Budget status */}
                        <div className={`col-span-6 order-2 sm:order-none sm:col-span-2 text-right lg:sidebar-expanded:hidden xl:sidebar-expanded:block`}>
                          <div
                            className={`text-xs inline-flex font-medium ${
                              budget.is_active
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'bg-rose-100 text-rose-600'
                            } rounded-full text-center px-2.5 py-1`}
                          >
                            {budget.is_active ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="absolute inset-0 border-2 border-transparent peer-checked:border-indigo-400 rounded pointer-events-none"
                      aria-hidden="true"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="lg:sticky lg:top-16 bg-slate-50 lg:overflow-x-hidden lg:overflow-y-auto no-scrollbar lg:shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 lg:w-[390px] lg:h-[calc(100vh-64px)]">
                {selectedBudget && (
                  <div className="py-8 px-4 lg:px-8">
                    <div className="max-w-sm mx-auto lg:max-w-none">

                      <div className="text-slate-800 font-semibold text-center mb-6">Budget Summary</div>

                      {/* Details */}
                      <div className="mt-6">
                        <div className="text-sm font-semibold text-slate-800 mb-1">Details</div>
                        <ul>
                          <li className="flex items-center justify-between py-3 border-b border-slate-200">
                            <div className="text-sm">Budget Name</div>
                            <div className="text-sm font-medium text-slate-800 ml-2">{selectedBudget.name}</div>
                          </li>
                          <li className="flex items-center justify-between py-3 border-b border-slate-200">
                            <div className="text-sm">Status</div>
                            <div className="flex items-center whitespace-nowrap">
                              <div className={`w-2 h-2 rounded-full ${selectedBudget.is_active ? 'bg-emerald-500' : 'bg-red-500'} mr-2`} />
                              <div className="text-sm font-medium text-slate-800">{selectedBudget.is_active ? 'Active' : 'Inactive'}</div>
                            </div>
                          </li>
                        </ul>
                      </div>

                      {/* Payment Limits */}
                      <div className="mt-6">
                        <div className="text-sm font-semibold text-slate-800 mb-4">Payment Limits</div>
                        <div className="pb-4 border-b border-slate-200">
                          <div className="flex justify-between text-sm mb-2">
                            <div>Spent Amount</div>
                            <div className="italic">
                              ${selectedBudget.spent_amount} <span className="text-slate-400">/</span> ${selectedBudget.target_amount}
                            </div>
                          </div>
                          <div className="relative w-full h-2 bg-slate-300">
                            <div className="absolute inset-0 bg-emerald-500" aria-hidden="true" style={{ width: `${(selectedBudget.spent_amount / selectedBudget.target_amount) * 100}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Edit / Delete */}
                      <div className="flex items-center space-x-3 mt-6">
                        <div className="w-1/2">
                          <button className="btn w-full border-slate-200 hover:border-slate-300 text-slate-600" onClick={handleEdit}>
                            <svg className="w-4 h-4 fill-current text-slate-500 shrink-0" viewBox="0 0 16 16">
                              <path d="M11.7.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM4.6 14H2v-2.6l6-6L10.6 8l-6 6zM12 6.6L9.4 4 11 2.4 13.6 5 12 6.6z" />
                            </svg>
                            <span className="ml-2">Edit Budget</span>
                          </button>
                        </div>
                        <div className="w-1/2">
                          <button className="btn w-full border-slate-200 hover:border-slate-300 text-rose-500" onClick={() => setConfirmDeleteModalOpen(true)}>
                            <svg className="w-4 h-4 fill-current text-rose-500 shrink-0" viewBox="0 0 16 16">
                              <path d="M11 7h1v7H4V7h1v6h6V7z" />
                              <path d="M9 3v1H7V3h2m1-1H6v3h4V2zM2 4h12v1H2z" />
                            </svg>
                            <span className="ml-2">Delete</span>
                          </button>
                        </div>
                      </div>

                      {/* Edit Modal */}
                      <EditBudgetModal
                        isOpen={isEditModalOpen}
                        onClose={handleCloseEditModal}
                        budget={selectedBudget}
                        fetchBudgets={fetchBudgets}
                      />

                      {/* Confirmation Modal */}
                      <ConfirmationModal
                        isOpen={confirmDeleteModalOpen}
                        onClose={() => setConfirmDeleteModalOpen(false)}
                        onConfirm={handleDelete}
                      />

                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Budgets;
