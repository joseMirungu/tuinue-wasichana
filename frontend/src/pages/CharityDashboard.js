import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { charityAPI } from '../utils/api';

const CharityDashboard = () => {
  const [stats, setStats] = useState({
    totalDonations: 0,
    beneficiariesCount: 0,
    activeRecurringDonors: 0
  });
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [stories, setStories] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [statsRes, beneficiariesRes, storiesRes] = await Promise.all([
          charityAPI.getStats(),
          charityAPI.getBeneficiaries(),
          charityAPI.getStories()
        ]);
        setStats(statsRes.data);
        setBeneficiaries(beneficiariesRes.data);
        setStories(storiesRes.data);
      } catch (error) {
        console.error('Error fetching charity data:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Donations</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">
            ${stats.totalDonations.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Active Beneficiaries</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {stats.beneficiariesCount}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Monthly Donors</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {stats.activeRecurringDonors}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Beneficiaries Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Beneficiaries</h3>
            <button
              onClick={() => navigate('/charity/beneficiaries/new')}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Add New
            </button>
          </div>
          <div className="border-t border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      School
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {beneficiaries.map((beneficiary) => (
                    <tr key={beneficiary.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {beneficiary.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {beneficiary.school}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {beneficiary.grade}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Stories Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Impact Stories</h3>
            <button
              onClick={() => navigate('/charity/stories/new')}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Add Story
            </button>
          </div>
          <div className="border-t border-gray-200">
            <div className="divide-y divide-gray-200">
              {stories.map((story) => (
                <div key={story.id} className="p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    {story.title}
                  </h4>
                  <p className="text-gray-600 mb-4 line-clamp-3">{story.content}</p>
                  {story.image_url && (
                    <img
                      src={story.image_url}
                      alt={story.title}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharityDashboard;