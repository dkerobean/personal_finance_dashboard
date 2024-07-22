import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const useAuthCheck = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/signin');
    } else {
      setLoading(false);
    }
  }, [navigate]);


  return loading;
};
