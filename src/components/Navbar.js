import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  X, 
  Bell, 
  User, 
  LogOut, 
  Calendar,
  BookOpen,
  Users,
  Settings,
  GraduationCap
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Class CS301 moved to Room 205', time: '2 hours ago', type: 'info' },
    { id: 2, message: 'Lab session tomorrow requires safety equipment', time: '1 day ago', type: 'warning' },
    { id: 3, message: 'New timetable published for next week', time: '2 days ago', type: 'success' }
  ]);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'student': return <GraduationCap size={20} />;
      case 'faculty': return <User size={20} />;
      case 'hod': return <BookOpen size={20} />;
      case 'admin': return <Settings size={20} />;
      default: return <User size={20} />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'student': return '#667eea';
      case 'faculty': return '#28a745';
      case 'hod': return '#ffc107';
      case 'admin': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <nav className="navbar" style={{
      background: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          {/* Logo */}
          <div className="d-flex align-items-center">
            <Calendar size={32} color="#667eea" className="me-3" />
            <div>
              <h4 className="mb-0" style={{ color: '#2c3e50' }}>Smart Timetable</h4>
              <small className="text-muted">AI-Powered Scheduler</small>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="d-none d-md-flex align-items-center">
            <div className="me-4 d-flex align-items-center">
              <div 
                className="d-flex align-items-center me-3 p-2 rounded"
                style={{ 
                  backgroundColor: `${getRoleColor(user?.role)}20`,
                  color: getRoleColor(user?.role)
                }}
              >
                {getRoleIcon(user?.role)}
                <span className="ms-2 fw-bold text-capitalize">{user?.role}</span>
              </div>
              <span className="text-muted">{user?.name}</span>
            </div>

            {/* Notifications */}
            <div className="position-relative me-3">
              <button 
                className="btn btn-outline-secondary"
                style={{ border: 'none', background: 'none' }}
                onClick={() => setNotifications([])}
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span 
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: '0.7rem' }}
                  >
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>

            {/* Logout */}
            <button 
              className="btn btn-outline-danger"
              onClick={logout}
            >
              <LogOut size={16} className="me-1" />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="btn d-md-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="d-md-none mt-3 pt-3 border-top">
            <div className="mb-3">
              <div 
                className="d-flex align-items-center p-2 rounded mb-2"
                style={{ 
                  backgroundColor: `${getRoleColor(user?.role)}20`,
                  color: getRoleColor(user?.role)
                }}
              >
                {getRoleIcon(user?.role)}
                <span className="ms-2 fw-bold text-capitalize">{user?.role}</span>
              </div>
              <div className="text-muted">{user?.name}</div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <span>Notifications ({notifications.length})</span>
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setNotifications([])}
              >
                Clear All
              </button>
            </div>

            <button 
              className="btn btn-outline-danger w-100"
              onClick={logout}
            >
              <LogOut size={16} className="me-1" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
