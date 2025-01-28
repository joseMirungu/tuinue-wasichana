import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tuinue Wasichana is dedicated to ensuring every girl has access to education
            by providing essential supplies and support they need to stay in school.
          </p>
        </div>

        {/* Vision and Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-gray-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600">
              A world where every girl has the opportunity to receive quality education,
              free from the barriers of inadequate resources and support.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• Education as a fundamental right</li>
              <li>• Dignity and respect for all</li>
              <li>• Community empowerment</li>
              <li>• Transparency and accountability</li>
              <li>• Sustainable impact</li>
            </ul>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team member cards would go here */}
            {[1, 2, 3].map((member) => (
              <div key={member} className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full mb-4"/>
                <h3 className="text-xl font-semibold text-gray-900">Team Member {member}</h3>
                <p className="text-gray-600">Position</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-red-600 rounded-xl text-white p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-lg mb-8">
            Together, we can make education accessible to every girl in need.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/donate"
              className="bg-white text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Donate Now
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-red-600 transition-colors"
            >
              Join Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;