import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import JobListings from './pages/JobListings';
import JobDetails from './pages/JobDetails';
import JobseekerDashboard from './pages/JobseekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import ApplyForm from './components/ApplyForm';

const App = () => {
  return (
    <GlobalErrorBoundary>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50">
          <Toaster position="top-right" toastOptions={{ className: 'glass' }} />
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<JobListings />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route element={<ProtectedRoute requiredRole="jobseeker" />}>
                <Route path="/jobseeker/dashboard" element={<JobseekerDashboard />} />
                <Route path="/apply/:id" element={<ApplyForm />} />
              </Route>
              
              <Route element={<ProtectedRoute requiredRole="employer" />}>
                <Route path="/employer/dashboard" element={<EmployerDashboard />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </GlobalErrorBoundary>
  );
};

export default App;