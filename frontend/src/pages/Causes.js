import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Droplet, Heart, Users } from 'lucide-react';

const causes = [
  {
    icon: Book,
    title: "Education Supplies",
    description: "Providing essential school supplies, including books, stationery, and uniforms to ensure girls can fully participate in their education.",
    impact: "2000+ girls supported"
  },
  {
    icon: Droplet,
    title: "Sanitary Products",
    description: "Ensuring girls have access to sanitary products and hygiene facilities, preventing them from missing school during menstruation.",
    impact: "50+ schools reached"
  },
  {
    icon: Heart,
    title: "Healthcare Support",
    description: "Providing access to basic healthcare and hygiene education to maintain good health and regular school attendance.",
    impact: "1000+ health kits distributed"
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Working with communities to build support systems and awareness about the importance of girls' education.",
    impact: "30+ communities engaged"
  }
];

const Causes = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-[#1F2937] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-6">Our Causes</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We focus on key areas that directly impact girls' education and well-being.
            Your support helps us create lasting change in these crucial areas.
          </p>
        </div>
      </div>

      {/* Causes Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {causes.map((cause, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-6">
                <div className="bg-red-100 p-3 rounded-lg">
                  <cause.icon className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 ml-4">{cause.title}</h2>
              </div>
              <p className="text-gray-600 mb-6">{cause.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">{cause.impact}</span>
                <Link 
                  to="/donate" 
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Support this cause →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Impact Stats */}
        <div className="mt-16 bg-gray-50 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-red-600">2000+</p>
              <p className="text-gray-600">Girls Supported</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-red-600">50+</p>
              <p className="text-gray-600">Schools Reached</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-red-600">30+</p>
              <p className="text-gray-600">Communities</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-red-600">500+</p>
              <p className="text-gray-600">Monthly Donors</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-red-600 rounded-xl text-white p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-lg mb-8">
            Your support can help keep more girls in school and create lasting change.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/donate"
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Donate Now
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-red-600 transition-colors"
            >
              Become a Monthly Donor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Causes;