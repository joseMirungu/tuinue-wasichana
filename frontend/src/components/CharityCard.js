import React from 'react';
import { Link } from 'react-router-dom';

const CharityCard = ({ charity, onDonate }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {charity.logo_url && (
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={charity.logo_url}
            alt={charity.name}
            className="object-cover w-full h-48"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {charity.name}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {charity.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {charity.tags?.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Total Donations</span>
            <span className="font-medium">${charity.total_donations?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Beneficiaries</span>
            <span className="font-medium">{charity.beneficiaries_count}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onDonate(charity)}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Donate Now
            </button>
            <Link
              to={`/charity/${charity.id}`}
              className="w-full flex justify-center py-2 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharityCard;