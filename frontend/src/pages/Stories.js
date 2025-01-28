import React from 'react';

const Stories = () => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Impact Stories</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((story) => (
            <div key={story} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src={`/api/placeholder/400/300`}
                alt={`Success Story ${story}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Success Story {story}
                </h3>
                <p className="text-gray-600 mb-4">
                  Through the support of our donors, another girl was able to continue
                  her education without interruption.
                </p>
                <div className="text-sm text-gray-500">
                  Posted on January {story}, 2025
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stories;