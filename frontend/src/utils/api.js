import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error handling for responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If unauthorized, remove token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Donor API
export const donorAPI = {
  getDashboard: () => api.get('/donor/dashboard'),
  getCharities: () => api.get('/donor/charities'),
  getDonations: () => api.get('/donor/donations'),
  createDonation: (donationData) => api.post('/donor/donations', donationData),
  getStories: () => api.get('/donor/stories'),
};

// Charity API
export const charityAPI = {
  getStats: () => api.get('/charity/stats'),
  getBeneficiaries: () => api.get('/charity/beneficiaries'),
  addBeneficiary: (beneficiaryData) => api.post('/charity/beneficiaries', beneficiaryData),
  getStories: () => api.get('/charity/stories'),
  createStory: (storyData) => api.post('/charity/stories', storyData),
  addSupplies: (supplyData) => api.post('/charity/supplies', supplyData),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getCharityApplications: () => api.get('/admin/charity-applications'),
  approveCharity: (charityId) => api.post(`/admin/charity-applications/${charityId}/approve`),
  rejectCharity: (charityId) => api.post(`/admin/charity-applications/${charityId}/reject`),
  deleteCharity: (charityId) => api.delete(`/admin/charities/${charityId}`),
};

// Export the Axios instance for custom requests
export default api;