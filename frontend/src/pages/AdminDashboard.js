import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../utils/api';
import { Users, Building2, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('charities');
  const [charityApplications, setCharityApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalCharities: 0,
    totalDonations: 0,
    totalBeneficiaries: 0
  });
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const [applicationsRes, statsRes, usersRes] = await Promise.all([
        adminAPI.getCharityApplications(),
        adminAPI.getStats(),
        fetch('http://localhost:5000/admin/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(res => res.json())
      ]);
      setCharityApplications(applicationsRes.data);
      setStats(statsRes.data);
      setUsers(usersRes);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate, fetchData]);

  const handleCharityAction = async (charityId, action) => {
    try {
      if (action === 'approve') {
        await adminAPI.approveCharity(charityId);
      } else if (action === 'reject') {
        await adminAPI.rejectCharity(charityId);
      } else if (action === 'delete') {
        await adminAPI.deleteCharity(charityId);
      }
      fetchData();
    } catch (error) {
      console.error(`Error ${action} charity:`, error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await fetch(`http://localhost:5000/admin/users/${userId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting user:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-red-600 mr-4" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Total Charities</h3>
              <p className="mt-2 text-3xl font-bold text-red-600">
                {stats.totalCharities}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-red-600 mr-4" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Total Donations</h3>
              <p className="mt-2 text-3xl font-bold text-red-600">
                ${stats.totalDonations.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-red-600 mr-4" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Users</h3>
              <p className="mt-2 text-3xl font-bold text-red-600">
                {users.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('charities')}
              className={`${
                activeTab === 'charities'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
            >
              Charity Applications
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
            >
              User Management
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'charities' ? (
        /* Charity Applications */
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
      ) : (
        /* Users Management */
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-bold text-gray-900">User Management</h2>
          </div>
          <div className="border-t border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.user_type === 'admin' ? 'bg-purple-100 text-purple-800' : 
                          user.user_type === 'charity' ? 'bg-green-100 text-green-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                        {user.user_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {user.is_verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
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
      )}
    </div>
  );
};

export default AdminDashboard;