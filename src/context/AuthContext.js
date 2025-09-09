import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    // Simulate API call
    const { email, password, role } = credentials;
    
    // Generate user data based on email and role
    const generateUserData = (email, role) => {
      const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      const baseUser = {
        id: Math.floor(Math.random() * 1000),
        name: name,
        email: email,
        role: role
      };

      switch (role) {
        case 'student':
          return {
            ...baseUser,
            department: 'Computer Science',
            year: '3rd Year',
            studentId: `CS${Math.floor(Math.random() * 9000) + 1000}`
          };
        case 'faculty':
          return {
            ...baseUser,
            department: 'Computer Science',
            designation: 'Professor',
            facultyId: `CS${Math.floor(Math.random() * 900) + 100}`
          };
        case 'hod':
          return {
            ...baseUser,
            department: 'Computer Science',
            designation: 'Head of Department',
            facultyId: `CS${Math.floor(Math.random() * 900) + 100}`
          };
        case 'admin':
          return {
            ...baseUser,
            designation: 'System Administrator'
          };
        default:
          return baseUser;
      }
    };

    // Allow any email to login - no password validation needed
    const userData = generateUserData(email, role);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
