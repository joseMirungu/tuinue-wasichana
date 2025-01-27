import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { donorAPI } from '../utils/api';
import DonationHistory from '../components/DonationHistory';

const DonorDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalDonated: 0,
    recentDonations: [],
    recurringDonations: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await donorAPI.getDashboard();
        setDashboardData(response.data);
      } catch (err) {
        console.error('Dashboard error:', err);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleCancelRecurring = async (donationId) => {
    try {
      await donorAPI.cancelRecurringDonation(donationId);
      const response = await donorAPI.getDashboard();
      setDashboardData(response.data);
    } catch (err) {
      console.error('Error canceling donation:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 gap-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Donated</h3>
            <p className="mt-2 text-3xl font-bold text-red-600">
              ${dashboardData.totalDonated.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Active Monthly Donations</h3>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {dashboardData.recurringDonations.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Charities Supported</h3>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {new Set(dashboardData.recentDonations.map(d => d.charity_id)).size}
            </p>
          </div>
        </div>

        {/* Monthly Donations */}
        {dashboardData.recurringDonations.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">Monthly Donations</h3>
            </div>
            <div className="border-t border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Charity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Next Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.recurringDonations.map((donation) => (
                    <tr key={donation.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {donation.charity_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${donation.amount.toFixed(2)}/month
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(donation.next_charge).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleCancelRecurring(donation.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Donation History */}
        <DonationHistory donations={dashboardData.recentDonations} />
      </div>
    </div>
  );
};

export default DonorDashboard;