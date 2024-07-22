import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 5000, // Adjust timeout as needed
});

// Request interceptor to add authorization header with access token
axiosInstance.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
let isRefreshing = false;
let refreshSubscribers = [];

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { config, response: { status } } = error;
    const originalRequest = config;

    // Handle token expired error
    if (status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        const refresh_token = localStorage.getItem('refresh_token');
        try {
          const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/token/`, { refresh_token });
          const new_access_token = response.data.access_token;
          localStorage.setItem('access_token', new_access_token);
          originalRequest.headers.Authorization = `Bearer ${new_access_token}`;
          refreshSubscribers.forEach((callback) => callback(new_access_token));
          refreshSubscribers = [];
          return axiosInstance(originalRequest);
        } catch (error) {
          console.error('Failed to refresh access token. Redirecting to login page.');
          // Handle logout or redirect to login page
          // Example: clear tokens and redirect to login page
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          navigate('/login');
        } finally {
          isRefreshing = false;
        }
      } else {
        // Queue the request and wait for token refresh
        return new Promise((resolve) => {
          refreshSubscribers.push((access_token) => {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;