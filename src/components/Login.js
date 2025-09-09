import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { User, Lock, Shield, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: 'johndoe@xyz.com',
    password: '********',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
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

  const roleOptions = [
    { value: 'student', label: 'Student', color: '#667eea' },
    { value: 'faculty', label: 'Faculty', color: '#28a745' },
    { value: 'hod', label: 'HOD', color: '#ffc107' },
    { value: 'admin', label: 'Admin', color: '#dc3545' }
  ];

  return (
    <div className="login-container" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="login-card" style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        maxWidth: '1000px',
        width: '100%',
        display: 'flex',
        minHeight: '600px'
      }}>
        {/* Left Section - Illustration */}
        <div className="login-illustration" style={{
          flex: '1',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
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
            <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '700', margin: 0 }}>SMART TIMETABLE</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: '8px 0 0 0' }}>AI-Powered Educational Management</p>
          </div>

          {/* Illustration */}
          <div className="illustration" style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            {/* Monitor */}
            <div style={{
              width: '200px',
              height: '120px',
              backgroundColor: '#e8f5e8',
              borderRadius: '12px',
              border: '3px solid #4ecdc4',
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
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div className="form-header" style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              color: '#2c3e50', 
              fontSize: '28px', 
              fontWeight: '700', 
              margin: '0 0 10px 0' 
            }}>
              Login as a {credentials.role.charAt(0).toUpperCase() + credentials.role.slice(1)} User
            </h2>
            <div style={{
              width: '60px',
              height: '4px',
              backgroundColor: '#667eea',
              borderRadius: '2px'
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
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {roleOptions.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setCredentials({...credentials, role: role.value})}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: credentials.role === role.value ? `2px solid ${role.color}` : '2px solid #e9ecef',
                      backgroundColor: credentials.role === role.value ? `${role.color}20` : 'white',
                      color: credentials.role === role.value ? role.color : '#6c757d',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
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
                color: '#2c3e50', 
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
                    padding: '15px 50px 15px 20px',
                    border: '2px solid #e9ecef',
                    borderRadius: '10px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  required
                />
                <User 
                  size={20} 
                  style={{ 
                    position: 'absolute', 
                    right: '15px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#6c757d'
                  }} 
                />
              </div>
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#2c3e50', 
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
                    padding: '15px 50px 15px 20px',
                    border: '2px solid #e9ecef',
                    borderRadius: '10px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
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
                    color: '#6c757d'
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
                padding: '15px',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: loading ? 0.7 : 1,
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#5a6fd8')}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#667eea')}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                  Signing In...
                </div>
              ) : (
                'LOGIN'
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
            backgroundColor: '#f8f9fa', 
            borderRadius: '10px',
            fontSize: '12px',
            color: '#6c757d'
          }}>
            <strong style={{ color: '#2c3e50' }}>Universal Login:</strong> You can login with any email address. The system will automatically assign the selected role.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
