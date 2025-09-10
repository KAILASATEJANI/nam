import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Bell, 
  Search, 
  User, 
  LogOut, 
  Settings,
  Globe,
  Moon,
  Sun,
  MessageSquare,
  ChevronDown,
  Menu,
  Home
} from 'lucide-react';

const TopNavbar = ({ isCollapsed, onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, colors, typography, spacing, borderRadius } = useTheme();
  const currentColors = isDarkMode ? colors.dark : colors.light;
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [language, setLanguage] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const notifications = [
    { id: 1, message: 'Class CS301 moved to Room 205', time: '2 hours ago', type: 'info', unread: true },
    { id: 2, message: 'Lab session tomorrow requires safety equipment', time: '1 day ago', type: 'warning', unread: true },
    { id: 3, message: 'New timetable published for next week', time: '2 days ago', type: 'success', unread: false },
    { id: 4, message: 'Attendance marked for Data Structures', time: '3 days ago', type: 'info', unread: false }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="top-navbar" style={{
      height: '64px',
      background: currentColors.surface,
      borderBottom: `1px solid ${currentColors.divider}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `0 ${spacing.xl}`,
      boxShadow: currentColors.shadowCard,
      position: 'fixed',
      top: 0,
      left: isCollapsed ? '80px' : '280px',
      right: 0,
      zIndex: 999,
      fontFamily: typography.fontFamily,
      transition: 'left 0.3s ease',
      color: currentColors.text
    }}>
      {/* Left Section - Mobile Menu & Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg, flex: 1 }}>
        {/* Mobile Menu Button */}
        <button
          onClick={onToggleSidebar}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            background: 'transparent',
            border: 'none',
            borderRadius: borderRadius.md,
            cursor: 'pointer',
            color: currentColors.textSecondary,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = currentColors.borderLight;
            e.target.style.color = currentColors.text;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = currentColors.textSecondary;
          }}
        >
          <Menu size={20} />
        </button>

        {/* Home Button */}
        <button
          onClick={() => {
            if (user?.role === 'student') navigate('/student/dashboard');
            else if (user?.role === 'faculty') navigate('/faculty');
            else if (user?.role === 'hod') navigate('/hod');
            else if (user?.role === 'admin') navigate('/admin');
            else navigate('/');
          }}
          title="Home"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            background: 'transparent',
            border: 'none',
            borderRadius: borderRadius.md,
            cursor: 'pointer',
            color: currentColors.textSecondary,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = currentColors.borderLight;
            e.target.style.color = currentColors.text;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = currentColors.textSecondary;
          }}
        >
          <Home size={20} />
        </button>

        {/* Search Bar */}
        <div style={{ position: 'relative', flex: 1, maxWidth: '500px' }}>
          <Search 
            size={20} 
            style={{ 
              position: 'absolute', 
              left: spacing.md, 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: currentColors.textMuted,
              pointerEvents: 'none'
            }} 
          />
          <input
            type="text"
            placeholder="Search for students/teachers/documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: '40px',
              padding: `0 ${spacing.md} 0 ${spacing['2xl']}`,
              border: `1px solid ${currentColors.border}`,
              borderRadius: borderRadius.sm,
              fontSize: typography.fontSizes.body1,
              background: currentColors.background,
              color: currentColors.text,
              outline: 'none',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              fontFamily: typography.fontFamily,
              boxShadow: currentColors.shadowCard
            }}
            onFocus={(e) => {
              e.target.style.borderColor = currentColors.primary;
              e.target.style.boxShadow = `0 0 0 2px ${currentColors.focus}`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = currentColors.border;
              e.target.style.boxShadow = currentColors.shadowCard;
            }}
          />
        </div>
      </div>

      {/* Right Section - Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
        {/* Language Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              padding: `${spacing.sm} ${spacing.md}`,
              background: 'transparent',
              border: `1px solid ${currentColors.border}`,
              borderRadius: borderRadius.md,
              cursor: 'pointer',
              color: currentColors.textSecondary,
              fontSize: typography.fontSizes.sm,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = currentColors.borderLight;
              e.target.style.color = currentColors.text;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = currentColors.textSecondary;
            }}
          >
            <Globe size={16} />
            <span>{languages.find(l => l.code === language)?.flag}</span>
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              background: 'transparent',
              border: 'none',
              borderRadius: borderRadius.md,
              cursor: 'pointer',
              color: currentColors.textSecondary,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = currentColors.borderLight;
              e.target.style.color = currentColors.text;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = currentColors.textSecondary;
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                background: currentColors.danger,
                color: currentColors.textLight,
                borderRadius: borderRadius.full,
                minWidth: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: typography.fontSizes.xs,
                fontWeight: typography.fontWeights.semibold
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              width: '320px',
              background: currentColors.card,
              border: `1px solid ${currentColors.border}`,
              borderRadius: borderRadius.lg,
              boxShadow: currentColors.shadow,
              marginTop: spacing.sm,
              zIndex: 1000
            }}>
              <div style={{
                padding: spacing.md,
                borderBottom: `1px solid ${currentColors.border}`,
                fontSize: typography.fontSizes.lg,
                fontWeight: typography.fontWeights.semibold,
                color: currentColors.text
              }}>
                Notifications
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    style={{
                      padding: spacing.md,
                      borderBottom: `1px solid ${currentColors.borderLight}`,
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                      background: notification.unread ? currentColors.primaryLight : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = currentColors.borderLight;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = notification.unread ? currentColors.primaryLight : 'transparent';
                    }}
                  >
                    <div style={{
                      fontSize: typography.fontSizes.sm,
                      color: currentColors.text,
                      marginBottom: spacing.xs
                    }}>
                          {notification.message}
                      </div>
                        <div style={{
                      fontSize: typography.fontSizes.xs,
                      color: currentColors.textMuted
                    }}>
                      {notification.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              padding: `${spacing.sm} ${spacing.md}`,
              background: 'transparent',
              border: `1px solid ${currentColors.border}`,
              borderRadius: borderRadius.md,
              cursor: 'pointer',
              color: currentColors.text,
              fontSize: typography.fontSizes.sm,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = currentColors.borderLight;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: borderRadius.full,
              background: currentColors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: currentColors.textLight,
              fontSize: typography.fontSizes.sm,
              fontWeight: typography.fontWeights.semibold
            }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: typography.fontSizes.sm, fontWeight: typography.fontWeights.medium }}>
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: typography.fontSizes.xs, color: currentColors.textMuted }}>
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Role'}
              </div>
            </div>
            <ChevronDown size={14} />
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              width: '200px',
              background: currentColors.card,
              border: `1px solid ${currentColors.border}`,
              borderRadius: borderRadius.lg,
              boxShadow: currentColors.shadow,
              marginTop: spacing.sm,
              zIndex: 1000
            }}>
              <div style={{
                padding: spacing.md,
                borderBottom: `1px solid ${currentColors.border}`,
                fontSize: typography.fontSizes.sm,
                fontWeight: typography.fontWeights.semibold,
                color: currentColors.text
              }}>
                Account
                </div>
              <div style={{ padding: spacing.sm }}>
                <button
                  style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                    gap: spacing.sm,
                    padding: `${spacing.sm} ${spacing.md}`,
                    background: 'transparent',
                    border: 'none',
                    borderRadius: borderRadius.md,
                    cursor: 'pointer',
                    color: currentColors.textSecondary,
                    fontSize: typography.fontSizes.sm,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = currentColors.borderLight;
                    e.target.style.color = currentColors.text;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = currentColors.textSecondary;
                  }}
                >
                  <User size={16} />
                  Profile
                </button>
                <button
                  style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                    gap: spacing.sm,
                    padding: `${spacing.sm} ${spacing.md}`,
                    background: 'transparent',
                    border: 'none',
                    borderRadius: borderRadius.md,
                    cursor: 'pointer',
                    color: currentColors.textSecondary,
                    fontSize: typography.fontSizes.sm,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = currentColors.borderLight;
                    e.target.style.color = currentColors.text;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = currentColors.textSecondary;
                  }}
                >
                  <Settings size={16} />
                  Settings
                </button>
                <div style={{ height: '1px', background: currentColors.border, margin: `${spacing.sm} 0` }} />

    
                <button
                  onClick={logout}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    padding: `${spacing.sm} ${spacing.md}`,
                    background: 'transparent',
                    border: 'none',
                    borderRadius: borderRadius.md,
                    cursor: 'pointer',
                    color: currentColors.danger,
                    fontSize: typography.fontSizes.sm,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = currentColors.dangerLight;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                  }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
