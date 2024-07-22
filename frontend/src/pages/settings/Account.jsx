import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import SettingsSidebar from '../../partials/settings/SettingsSidebar';
import AccountPanel from '../../partials/settings/AccountPanel';
import { fetchUserProfile } from '../../utils/UserProfile';
import { useAuthCheck } from '../../utils/Auth';

function Account() {

  const [userProfile, setUserProfile] = useState(null);
  const loading = useAuthCheck();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check auth and fetch user profile
 useEffect(() => {
    if (!loading) {
      fetchUserProfile()
        .then(profile => setUserProfile(profile))
        .catch(error => {
          console.log("Failed to fetch user profile:", error);
          navigate('/signin');
        });
    }
  }, [loading, navigate]);

  if (loading) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Page header */}
            <div className="mb-8">
              {/* Title */}
              <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">Account Settings ✨</h1>
            </div>

            {/* Content */}
            <div className="bg-white shadow-lg rounded-sm mb-8">
              <div className="flex flex-col md:flex-row md:-mr-px">
                <SettingsSidebar  />
                <AccountPanel profile={userProfile}/>
              </div>
            </div>

          </div>
        </main>

      </div>

    </div>
  );
}

export default Account;