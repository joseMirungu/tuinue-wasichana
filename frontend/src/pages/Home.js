import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, School, Users, Heart } from 'lucide-react';

const Home = () => {
  const [stats, setStats] = useState({
    schoolsReached: 0,
    donorsCount: 0,
    beneficiariesCount: 0
  });

  // Animate statistics on load
  useEffect(() => {
    const targetStats = {
      schoolsReached: 50,
      donorsCount: 500,
      beneficiariesCount: 2000
    };

    const animationDuration = 2000; // 2 seconds
    const steps = 60;
    const interval = animationDuration / steps;

    const incrementValues = {
      schoolsReached: targetStats.schoolsReached / steps,
      donorsCount: targetStats.donorsCount / steps,
      beneficiariesCount: targetStats.beneficiariesCount / steps
    };

    let currentStep = 0;

    const timer = setInterval(() => {
      if (currentStep < steps) {
        setStats(prevStats => ({
          schoolsReached: Math.min(Math.round(incrementValues.schoolsReached * (currentStep + 1)), targetStats.schoolsReached),
          donorsCount: Math.min(Math.round(incrementValues.donorsCount * (currentStep + 1)), targetStats.donorsCount),
          beneficiariesCount: Math.min(Math.round(incrementValues.beneficiariesCount * (currentStep + 1)), targetStats.beneficiariesCount)
        }));
        currentStep++;
      } else {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-[#1F2937] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl font-bold leading-tight">
                Empowering Girls Through
                <span className="text-red-500"> Education</span>
              </h1>
              <p className="text-xl text-gray-300">
                Support education by providing essential supplies to girls in need.
                Make a difference in their lives through your generous donations.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/donate"
                  className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Donate Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="/api/placeholder/600/400"
                alt="Girls in education"
                className="rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-xl p-6 transform hover:-translate-y-2 transition-transform duration-300">
                <div className="flex items-center space-x-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <School className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-gray-900">{stats.schoolsReached}+</p>
                    <p className="text-gray-600">Schools Reached</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-xl p-6 transform hover:-translate-y-2 transition-transform duration-300">
                <div className="flex items-center space-x-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-gray-900">{stats.beneficiariesCount}+</p>
                    <p className="text-gray-600">Girls Supported</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-xl p-6 transform hover:-translate-y-2 transition-transform duration-300">
                <div className="flex items-center space-x-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-gray-900">{stats.donorsCount}+</p>
                    <p className="text-gray-600">Monthly Donors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Section */}
      <div className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Our Impact</h2>
            <p className="mt-4 text-lg text-gray-600">
              See how your donations make a difference in the lives of young girls
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((card) => (
              <div 
                key={card}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src={`/api/placeholder/400/${300 + card}`}
                    alt={`Impact story ${card}`}
                    className="object-cover w-full h-48"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Success Story {card}
                  </h3>
                  <p className="text-gray-600">
                    Thanks to donors like you, we've been able to help more girls stay in school
                    and achieve their dreams.
                  </p>
                  <Link
                    to="/stories"
                    className="mt-4 inline-flex items-center text-red-600 hover:text-red-700"
                  >
                    Read more <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Make a Difference?</h2>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Join Us Today
            </Link>
            <Link
              to="/donate"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-red-600 transition-colors"
            >
              Donate Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;