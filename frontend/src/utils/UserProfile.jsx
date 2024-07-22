import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const fetchUserProfile = async () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('access_token');
  try {
    const response = await axios.get(`${backendUrl}/user/profile/view/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    toast.error("Error fetching user profile:", error);
    console.error("Error fetching user profile:", error);
    throw error;
  }
};