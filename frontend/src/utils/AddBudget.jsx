import React, { useState, useEffect } from "react";
import axios from 'axios';
import ModalBasic from "../components/ModalBasic";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { fetchUserProfile } from "./UserProfile";

export function AddBudget() {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [duration, setDuration] = useState('monthly');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [userId, setUserId] = useState('');

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('access_token');

  // Fetch user profile
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

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${backendUrl}/transactions/category/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [backendUrl, token]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name,
      target_amount: targetAmount,
      duration,
      user: userId
    };

    await axios.post(`${backendUrl}/budget/all/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        toast.success('Budget added successfully');
      })
      .catch(error => {
        toast.error('There was an error adding the budget!');
        console.log(error);
      });

    // Clear form fields after submission
    setName('');
    setTargetAmount('');
    setDuration('monthly');
    setCategory('');
    setFeedbackModalOpen(false);
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
        <span className="hidden xs:block ml-2">Add Budget</span>
      </button>
      <ModalBasic id="feedback-modal" modalOpen={feedbackModalOpen} setModalOpen={setFeedbackModalOpen} title="Add a Budget">
        <form onSubmit={handleFormSubmit}>
          <div className="px-5 py-4">
            <div className="text-sm">
              <div className="font-medium text-slate-800 mb-3">Add A Budget</div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="name">Name <span className="text-rose-500">*</span></label>
                <input
                  id="name"
                  className="form-input w-full px-2 py-1"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="targetAmount">Target Amount <span className="text-rose-500">*</span></label>
                <input
                  id="targetAmount"
                  className="form-input w-full px-2 py-1"
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="duration">Duration <span className="text-rose-500">*</span></label>
                <select
                  id="duration"
                  className="form-select w-full"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                   <option value="yearly">Weekly</option>
                </select>
              </div>
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