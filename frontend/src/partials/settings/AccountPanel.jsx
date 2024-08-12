import React, { useState, useEffect } from 'react';
import Image from '../../images/user-avatar-80.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AccountPanel({ profile }) {
  const [sync, setSync] = useState(false);
  const [formData, setFormData] = useState({
    user: {
    username: '',
    email: '',
  },
  full_name: '',
  address: '',
  phone_number: '',
  date_of_birth: ''
});

  useEffect(() => {
  if (profile) {
    setFormData({
      user: {
        username: profile.user.username,
        email: profile.user.email,
      },
      full_name: profile.full_name,
      address: profile.address,
      phone_number: profile.phone_number,
      date_of_birth: profile.date_of_birth
    });
  }
}, [profile]);

  const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData((prevFormData) => {
    if (name === 'username' || name === 'email') {
      return {
        ...prevFormData,
        user: {
          ...prevFormData.user,
          [name]: value
        }
      };
    }
    return {
      ...prevFormData,
      [name]: value,
    };
  });
};
  // handle form submission

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('access_token');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/user/profile/view/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // On success, reload the current page
      window.location.reload();
      toast.success("Update successfull");
    } catch (error) {
      toast.error("Error updating profile", error);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grow">
      {/* Panel body */}
      <div className="p-6 space-y-6">
        <h2 className="text-2xl text-slate-800 font-bold mb-5">My Account</h2>

        {/* Picture */}
        {/* <section>
          <div className="flex items-center">
            <div className="mr-4">
              <img className="w-20 h-20 rounded-full" src={Image} width="80" height="80" alt="User upload" />
            </div>
            <button className="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white">Change</button>
          </div>
        </section> */}

        {/* Account Form */}
        <form onSubmit={handleFormSubmit}>
          <section>
            <h2 className="text-xl leading-snug text-slate-800 font-bold mb-1">Account Information</h2>
            <div className="text-sm mb-5">Update your personal information.</div>
            <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="sm:w-1/2">
                <label className="block text-sm font-medium mb-1" htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  className="form-input w-full"
                  type="text"
                  value={formData.user.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="sm:w-1/2">
                <label className="block text-sm font-medium mb-1" htmlFor="full_name">Full Name</label>
                <input
                  id="full_name"
                  name="full_name"
                  className="form-input w-full"
                  type="text"
                  value={formData.full_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="sm:w-1/2">
                <label className="block text-sm font-medium mb-1" htmlFor="full_name">Email</label>
                <input
                  id="email"
                  name="email"
                  className="form-input w-full"
                  type="text"
                  value={formData.user.email}
                  onChange={handleInputChange}
                  disabled

                />
              </div>
            </div>
            <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
              <div className="sm:w-1/3">
                <label className="block text-sm font-medium mb-1" htmlFor="address">Address</label>
                <input
                  id="address"
                  name="address"
                  className="form-input w-full"
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="sm:w-1/3">
                <label className="block text-sm font-medium mb-1" htmlFor="phone_number">Phone Number</label>
                <input
                  id="phone_number"
                  name="phone_number"
                  className="form-input w-full"
                  type="text"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                />
              </div>
              <div className="sm:w-1/3">
                <label className="block text-sm font-medium mb-1" htmlFor="date_of_birth">Date of Birth</label>
                <input
                  id="date_of_birth"
                  name="date_of_birth"
                  className="form-input w-full"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex self-end mt-5">
              <button type="submit" className="btn bg-indigo-500 hover:bg-indigo-600 text-white">Save Changes</button>
            </div>
          </section>
        </form>

        {/* Password Form */}
        <section className="mt-8">
          <h2 className="text-xl leading-snug text-slate-800 font-bold mb-1">Password</h2>
          <div className="text-sm mb-5">You can set a permanent password if you don't want to use temporary login codes.</div>
          <div className="mt-5">
            <button className="btn border-slate-200 shadow-sm text-indigo-500">Set New Password</button>
          </div>
        </section>

        {/* Smart Sync */}
        {/* <section>
          <h2 className="text-xl leading-snug text-slate-800 font-bold mb-1">Smart Sync update for Mac</h2>
          <div className="text-sm">With this update, online-only files will no longer appear to take up hard drive space.</div>
          <div className="flex items-center mt-5">
            <div className="form-switch">
              <input type="checkbox" id="toggle" className="sr-only" checked={sync} onChange={() => setSync(!sync)} />
              <label className="bg-slate-400" htmlFor="toggle">
                <span className="bg-white shadow-sm" aria-hidden="true"></span>
                <span className="sr-only">Enable smart sync</span>
              </label>
            </div>
            <div className="text-sm text-slate-400 italic ml-2">{sync ? 'On' : 'Off'}</div>
          </div>
        </section> */}
      </div>

      {/* Panel footer */}
      <footer>
        <div className="flex flex-col px-6 py-5 border-t border-slate-200">
          <div className="flex self-end">
            <button className="btn border-slate-200 hover:border-slate-300 text-slate-600">Cancel</button>
            <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3">Save Changes</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AccountPanel;