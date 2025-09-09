import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import HODDashboard from './components/HODDashboard';
import AdminDashboard from './components/AdminDashboard';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
        color: 'white',
        fontSize: '18px'
      }}>
        <div>Loading Smart Classroom System...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {!user ? (
            <>
              <Route path="/*" element={<Login />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to={user.role === 'student' ? '/student/dashboard' : `/${user.role}`} />} />
              <Route path="/student" element={<Navigate to="/student/dashboard" />} />
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/faculty" element={<FacultyDashboard />} />
              <Route path="/hod" element={<HODDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </>
          )}
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
