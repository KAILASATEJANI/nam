import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { User, Lock, Shield, Eye, EyeOff, LogOut } from 'lucide-react';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: 'johndoe@xyz.com',
    password: '********',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Allow any email to login with any password
      const result = await login({
        ...credentials,
        email: credentials.email,
        password: credentials.password || 'password123' // Default password for any email
      });
      if (result.success) {
        toast.success('Login successful!');
        // Route to role-specific dashboard immediately
        if (credentials.role === 'student') navigate('/student/dashboard');
        else if (credentials.role === 'faculty') navigate('/faculty');
        else if (credentials.role === 'hod') navigate('/hod');
        else if (credentials.role === 'admin') navigate('/admin');
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
  };

  const roleOptions = [
    { value: 'student', label: 'Student', color: '#667eea' },
    { value: 'faculty', label: 'Faculty', color: '#28a745' },
    { value: 'hod', label: 'HOD', color: '#ffc107' },
    { value: 'admin', label: 'Admin', color: '#dc3545' }
  ];

  return (
    <div className="login-container" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0f2ff 0%, #eef2ff 40%, #dbeafe 100%)',
      backgroundImage: `radial-gradient(60rem 30rem at -10% -20%, rgba(99,102,241,0.20) 0%, rgba(99,102,241,0) 60%),
                        radial-gradient(40rem 20rem at 110% 120%, rgba(14,165,233,0.18) 0%, rgba(14,165,233,0) 60%),
                        repeating-linear-gradient(45deg, rgba(99,102,241,0.04) 0px, rgba(99,102,241,0.04) 2px, transparent 2px, transparent 6px)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <style>{`
        /* Enhanced Responsive Login Styles */
        @media (max-width: 991px) {
          .login-card {
            flex-direction: column !important;
            max-width: 95% !important;
            margin: 20px auto !important;
            min-height: auto !important;
          }
          .login-illustration {
            display: none !important;
          }
          .login-form {
            padding: 40px 20px !important;
          }
        }
        
        @media (max-width: 768px) {
          .login-container {
            padding: 15px !important;
          }
          .login-card {
            margin: 15px auto !important;
            border-radius: 24px !important;
          }
          .login-form {
            padding: 35px 20px !important;
          }
          .form-header h2 {
            font-size: 24px !important;
          }
          .clear-session-btn {
            padding: 6px 10px !important;
            font-size: 11px !important;
          }
        }
        
        @media (max-width: 576px) {
          .login-container {
            padding: 10px !important;
          }
          .login-card {
            margin: 10px !important;
            border-radius: 20px !important;
          }
          .login-form {
            padding: 30px 15px !important;
          }
          .form-header h2 {
            font-size: 22px !important;
          }
          .clear-session-btn {
            display: none !important;
          }
          .role-buttons {
            flex-direction: column !important;
            gap: 8px !important;
          }
          .role-buttons button {
            width: 100% !important;
          }
        }
        
        @media (max-width: 480px) {
          .login-form {
            padding: 25px 12px !important;
          }
          .form-header h2 {
            font-size: 20px !important;
          }
          .form-header {
            margin-bottom: 30px !important;
          }
        }
        
        /* Landscape orientation for mobile */
        @media (orientation: landscape) and (max-height: 500px) {
          .login-container {
            padding: 5px !important;
          }
          .login-card {
            min-height: auto !important;
            max-height: 95vh !important;
            overflow-y: auto !important;
          }
          .login-illustration {
            min-height: 120px !important;
            padding: 15px !important;
          }
          .login-form {
            padding: 20px 15px !important;
          }
          .form-header {
            margin-bottom: 20px !important;
          }
        }
        
        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .role-buttons button {
            min-height: 44px !important;
            padding: 12px 18px !important;
          }
          input[type="email"], input[type="password"] {
            min-height: 44px !important;
            font-size: 16px !important; /* Prevents zoom on iOS */
          }
          button[type="submit"] {
            min-height: 48px !important;
          }
        }
        
        /* Fix for iOS Safari input zoom */
        @supports (-webkit-touch-callout: none) {
          input[type="email"], input[type="password"] {
            font-size: 16px !important;
            transform: translateZ(0);
          }
        }
        
        /* Prevent text selection on buttons */
        .role-buttons button,
        button[type="submit"] {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        
        /* Smooth transitions */
        .login-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Fix for layout shift */
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
      <div className="login-card" style={{
        background: 'rgba(255,255,255,0.55)',
        border: '1px solid rgba(255,255,255,0.35)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '28px',
        boxShadow: '0 30px 60px rgba(30,58,138,0.18), inset 0 1px 0 rgba(255,255,255,0.6)',
        overflow: 'hidden',
        maxWidth: '1060px',
        width: '100%',
        display: 'flex',
        minHeight: '640px'
      }}>
        {/* Left Section - Illustration */}
        <div className="login-illustration" style={{
          flex: '1.05',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #38bdf8 100%)',
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }}>
          {/* Company Logo */}
          <div className="logo-section" style={{ marginBottom: '40px', textAlign: 'center' }}>
            <div className="logo-circles" style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff6b6b' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#4ecdc4' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#45b7d1' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f9ca24' }}></div>
            </div>
            <h2 style={{ color: 'white', fontSize: '26px', fontWeight: '800', margin: 0, letterSpacing: '0.5px' }}>SMART TIMETABLE</h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', margin: '8px 0 0 0' }}>AI-Powered Educational Management</p>
          </div>

          {/* Illustration */}
          <div className="illustration" style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            {/* Monitor */}
            <div style={{
              width: '220px',
              height: '140px',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.35)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)',
              backdropFilter: 'blur(6px)',
              position: 'relative',
              margin: '0 auto'
            }}>
              {/* User Icon in Monitor */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '40px',
                height: '40px',
                backgroundColor: '#ff6b6b',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={20} color="white" />
              </div>
              
              {/* Lock Icon */}
              <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                width: '16px',
                height: '16px',
                backgroundColor: '#f9ca24',
                borderRadius: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Lock size={10} color="white" />
              </div>
            </div>

            {/* Shield Icon */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '50px',
              height: '50px',
              backgroundColor: '#667eea',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={24} color="white" />
            </div>

            {/* Decorative Elements */}
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              width: '8px',
              height: '8px',
              backgroundColor: '#ff6b6b',
              borderRadius: '50%'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '30px',
              width: '6px',
              height: '6px',
              backgroundColor: '#f9ca24',
              borderRadius: '50%'
            }}></div>
            <div style={{
              position: 'absolute',
              top: '60px',
              right: '10px',
              width: '4px',
              height: '4px',
              backgroundColor: '#4ecdc4',
              borderRadius: '50%'
            }}></div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="login-form" style={{
          flex: '1',
          padding: '60px 48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.65), rgba(255,255,255,0.35))',
          backdropFilter: 'blur(8px)'
        }}>
          <div className="form-header" style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h2 style={{ 
                color: '#0f172a', 
                fontSize: '28px', 
                fontWeight: '800', 
                margin: 0 
              }}>
                Login as a {credentials.role.charAt(0).toUpperCase() + credentials.role.slice(1)} User
              </h2>
              <button
                className="clear-session-btn"
                onClick={handleLogout}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  color: '#dc2626',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                }}
              >
                <LogOut size={14} />
                Clear Session
              </button>
            </div>
            <div style={{
              width: '68px',
              height: '4px',
              background: 'linear-gradient(90deg, #38bdf8, #6366f1)',
              borderRadius: '999px'
            }}></div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '15px', 
                color: '#2c3e50', 
                fontWeight: '600',
                fontSize: '14px'
              }}>
                Select Role
              </label>
              <div className="role-buttons" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {roleOptions.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setCredentials({...credentials, role: role.value})}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '999px',
                      border: '1px solid rgba(99,102,241,0.25)',
                      background: credentials.role === role.value
                        ? 'linear-gradient(180deg, rgba(99,102,241,0.18), rgba(14,165,233,0.14))'
                        : 'rgba(255,255,255,0.6)',
                      color: credentials.role === role.value ? role.color : '#334155',
                      boxShadow: credentials.role === role.value
                        ? '0 6px 16px rgba(99,102,241,0.25)'
                        : 'inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 2px rgba(0,0,0,0.04)',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      backdropFilter: 'blur(6px)'
                    }}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Input */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#0f172a', 
                fontWeight: '600',
                fontSize: '14px'
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '16px 50px 16px 20px',
                    borderRadius: '14px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    background: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    boxShadow: 'inset 0 2px 8px rgba(2,6,23,0.06), 0 1px 0 rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(6px)'
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.18)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.25)'; e.target.style.boxShadow = 'inset 0 2px 8px rgba(2,6,23,0.06), 0 1px 0 rgba(255,255,255,0.8)'; }}
                  required
                />
                <User 
                  size={20} 
                  style={{ 
                    position: 'absolute', 
                    right: '15px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#64748b'
                  }} 
                />
              </div>
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#0f172a', 
                fontWeight: '600',
                fontSize: '14px'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '16px 50px 16px 20px',
                    borderRadius: '14px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    background: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    boxShadow: 'inset 0 2px 8px rgba(2,6,23,0.06), 0 1px 0 rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(6px)'
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.18)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.25)'; e.target.style.boxShadow = 'inset 0 2px 8px rgba(2,6,23,0.06), 0 1px 0 rgba(255,255,255,0.8)'; }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(90deg, #38bdf8, #6366f1)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.35)',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: '800',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s ease',
                opacity: loading ? 0.7 : 1,
                letterSpacing: '0.6px',
                boxShadow: '0 12px 24px rgba(99,102,241,0.30), 0 6px 12px rgba(56,189,248,0.25)'
              }}
              onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-1px) scale(1.01)')}
              onMouseOut={(e) => !loading && (e.target.style.transform = 'none')}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Links */}
          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <div style={{ marginBottom: '15px' }}>
              <a href="#" style={{ 
                color: '#667eea', 
                textDecoration: 'none', 
                fontSize: '14px',
                fontWeight: '600',
                marginRight: '20px'
              }}>
                Forget your password?
              </a>
              <a href="#" style={{ 
                color: '#667eea', 
                textDecoration: 'none', 
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Get help Signed in.
              </a>
            </div>
            <div style={{ color: '#6c757d', fontSize: '12px' }}>
              <a href="#" style={{ color: '#6c757d', textDecoration: 'none', marginRight: '10px' }}>
                Terms of use.
              </a>
              <a href="#" style={{ color: '#6c757d', textDecoration: 'none' }}>
                Privacy policy
              </a>
            </div>
          </div>

          {/* Demo Info */}
          <div style={{ 
            marginTop: '30px', 
            padding: '15px', 
            background: 'rgba(255,255,255,0.65)',
            border: '1px solid rgba(99,102,241,0.15)',
            borderRadius: '14px',
            fontSize: '12px',
            color: '#475569',
            backdropFilter: 'blur(6px)'
          }}>
            <strong style={{ color: '#2c3e50' }}>Universal Login:</strong> You can login with any email address. The system will automatically assign the selected role.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
