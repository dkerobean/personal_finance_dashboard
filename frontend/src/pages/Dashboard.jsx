import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import DashboardAvatars from '../partials/dashboard/DashboardAvatars';
import FilterButton from '../components/DropdownFilter';
import Datepicker from '../components/Datepicker';
import DashboardCard01 from '../partials/dashboard/DashboardCard01';
import DashboardCard02 from '../partials/dashboard/DashboardCard02';
import DashboardCard03 from '../partials/dashboard/DashboardCard03';
import DashboardCard04 from '../partials/dashboard/DashboardCard04';
import DashboardCard05 from '../partials/dashboard/DashboardCard05';
import DashboardCard06 from '../partials/dashboard/DashboardCard06';
import DashboardCard07 from '../partials/dashboard/DashboardCard07';
import DashboardCard08 from '../partials/dashboard/DashboardCard08';
import DashboardCard09 from '../partials/dashboard/DashboardCard09';
import DashboardCard10 from '../partials/dashboard/DashboardCard10';
import DashboardCard11 from '../partials/dashboard/DashboardCard11';

import FintechIntro from '../partials/fintech/FintechIntro';
import FintechCard01 from '../partials/fintech/FintechCard01';
import FintechCard09 from '../partials/fintech/FintechCard09';

import { fetchUserProfile } from '../utils/UserProfile';
import { useAuthCheck } from '../utils/Auth';

function Dashboard() {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const loading = useAuthCheck();
    const navigate = useNavigate();

  // Check auth and fetch user profile
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

    if (loading) {
      return null;
    }

    const profile = userProfile || {};

    const currency = profile.currency_symbol || '';
    const cash_flow = profile.cash_flow || 0;
    const net_worth = profile.net_worth || 0;
    const total_spending = profile.total_spending || 0;


  return (
    <div className="flex h-screen overflow-hidden">
    <ToastContainer />
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Welcome banner */}
            <WelcomeBanner />

            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">

              {/* Left: Avatars */}
              <DashboardAvatars />



            </div>

            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">

              <FintechIntro profile={userProfile}/>

              {/* Line chart (Acme Plus) */}
              <DashboardCard01  net_worth={net_worth} currency={currency} />
              {/* Line chart (Acme Advanced) */}
              <DashboardCard02 cash_flow={cash_flow} currency={currency}/>
              {/* Line chart (Acme Professional) */}
              <DashboardCard03 total_spending={total_spending} currency={currency}/>
              {/* Bar chart (Cashflow) */}
              <DashboardCard04 />
              {/* Line chart (Balance Trend) */}
              <FintechCard01 />
              {/* Doughnut chart (Expense Structure) */}
              <FintechCard09 />
              {/* Card (Last Records) */}
              <DashboardCard11 />
              {/* Table (Top Channels) */}
              {/* <DashboardCard07 /> */}
              {/* Line chart (Sales Over Time) */}
              {/* <DashboardCard08 /> */}
              {/* Stacked bar chart (Sales VS Refunds) */}
              {/* <DashboardCard09 /> */}
              {/* Card (Recent Activity) */}
              {/* <DashboardCard10 /> */}


            </div>

          </div>
        </main>

      </div>

    </div>
  );
}

export default Dashboard;