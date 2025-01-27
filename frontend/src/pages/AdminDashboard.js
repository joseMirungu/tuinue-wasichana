import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../utils/api';

const AdminDashboard = () => {
  const [charityApplications, setCharityApplications] = useState([]);
  const [stats, setStats] = useState({
    totalCharities: 0,
    totalDonations: 0,
    totalBeneficiaries: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        const [applicationsRes, statsRes] = await Promise.all([
          adminAPI.getCharityApplications(),
          adminAPI.getStats()
        ]);
        setCharityApplications(applicationsRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleCharityAction = async (charityId, action) => {
    try {
      if (action === 'approve') {
        await adminAPI.approveCharity(charityId);
      } else if (action === 'reject') {
        await adminAPI.rejectCharity(charityId);
      } else if (action === 'delete') {
        await adminAPI.deleteCharity(charityId);
      }
      // Refresh data after action
      const { data } = await adminAPI.getCharityApplications();
      setCharityApplications(data);
    } catch (error) {
      console.error(`Error ${action} charity:`, error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Charities</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {stats.totalCharities}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Donations</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">
            ${stats.totalDonations.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Beneficiaries</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {stats.totalBeneficiaries}
          </p>
        </div>
      </div>

      {/* Charity Applications */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-xl font-bold text-gray-900">Charity Applications</h2>
        </div>
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {charityApplications.map(charity => (
                <tr key={charity.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{charity.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{charity.registration_number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{charity.contact_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${charity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        charity.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'}`}
                    >
                      {charity.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {charity.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleCharityAction(charity.id, 'approve')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleCharityAction(charity.id, 'reject')}
                          className="text-red-600 hover:text-red-900 ml-2"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleCharityAction(charity.id, 'delete')}
                      className="text-gray-600 hover:text-gray-900 ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;