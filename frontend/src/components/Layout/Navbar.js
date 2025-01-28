import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check auth status whenever location changes or component mounts
  useEffect(() => {
    checkAuthStatus();
  }, [location]);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType');
    setIsAuthenticated(!!token);
    setUserType(storedUserType);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setIsAuthenticated(false);
    setUserType(null);
    navigate('/');
  };

  const getDashboardLink = () => {
    switch (userType) {
      case 'admin':
        return '/admin';
      case 'charity':
        return '/charity';
      case 'donor':
        return '/donor';
      default:
        return '/';
    }
  };

  return (
    <nav className="bg-[#1F2937] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="text-xl font-bold">Tuinue Wasichana</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
            <Link to="/about" className="text-gray-300 hover:text-white">About</Link>
            <Link to="/causes" className="text-gray-300 hover:text-white">Causes</Link>
            <Link to="/stories" className="text-gray-300 hover:text-white">Stories</Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to={getDashboardLink()}
                  className="text-gray-300 hover:text-white flex items-center"
                >
                  <User className="h-5 w-5 mr-1" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/donate" 
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Donate Now
                </Link>
                <Link to="/login" className="text-gray-300 hover:text-white">
                  Login
                </Link>
                <Link to="/register" className="bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
              <Link to="/about" className="text-gray-300 hover:text-white">About</Link>
              <Link to="/causes" className="text-gray-300 hover:text-white">Causes</Link>
              <Link to="/stories" className="text-gray-300 hover:text-white">Stories</Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to={getDashboardLink()}
                    className="text-gray-300 hover:text-white flex items-center"
                  >
                    <User className="h-5 w-5 mr-1" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center w-full"
                  >
                    <LogOut className="h-5 w-5 mr-1" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/donate" 
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Donate Now
                  </Link>
                  <Link to="/login" className="text-gray-300 hover:text-white">
                    Login
                  </Link>
                  <Link to="/register" className="bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;