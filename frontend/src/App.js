import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Causes from './pages/Causes';
import Stories from './pages/Stories';
import Login from './pages/Login';
import Register from './pages/Register';
import DonorDashboard from './pages/DonorDashboard';
import CharityDashboard from './pages/CharityDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DonationForm from './components/DonationForm';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userType)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/causes" element={<Causes />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route 
              path="/donate" 
              element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <DonationForm />
                </ProtectedRoute>
              } 
            />

            <Route
              path="/donor/*"
              element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <DonorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/charity/*"
              element={
                <ProtectedRoute allowedRoles={['charity']}>
                  <CharityDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Sub-routes for dashboards */}
            <Route path="/donor/donations" element={<DonorDashboard />} />
            <Route path="/donor/profile" element={<DonorDashboard />} />
            <Route path="/charity/beneficiaries" element={<CharityDashboard />} />
            <Route path="/charity/stories" element={<CharityDashboard />} />
            <Route path="/charity/profile" element={<CharityDashboard />} />
            <Route path="/admin/charities" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminDashboard />} />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;