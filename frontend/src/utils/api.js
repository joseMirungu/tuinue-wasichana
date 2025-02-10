import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add token to requests if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Export API functions
export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        user_type: userData.user_type
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    
    return response.json();
  }
};

export const donorAPI = {
  getDashboard: () => api.get('/donor/dashboard'),
  getCharities: () => api.get('/donor/charities'),
  getDonations: () => api.get('/donor/donations'),
  createDonation: (donationData) => api.post('/donor/donations', donationData),
  getStories: () => api.get('/donor/stories'),
};

export const charityAPI = {
  getStats: () => api.get('/charity/stats'),
  getBeneficiaries: () => api.get('/charity/beneficiaries'),
  addBeneficiary: (beneficiaryData) => api.post('/charity/beneficiaries', beneficiaryData),
  getStories: () => api.get('/charity/stories'),
  createStory: (formData) => api.post('/charity/stories', formData),
  addSupplies: (supplyData) => api.post('/charity/supplies', supplyData),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getCharityApplications: () => api.get('/admin/charity-applications'),
  approveCharity: (charityId) => api.post(`/admin/charity-applications/${charityId}/approve`),
  rejectCharity: (charityId) => api.post(`/admin/charity-applications/${charityId}/reject`),
  deleteCharity: (charityId) => api.delete(`/admin/charities/${charityId}`),
};

export default api;