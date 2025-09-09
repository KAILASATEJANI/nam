import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  Bell, 
  BarChart3, 
  Users, 
  Settings, 
  BookOpen,
  Clock,
  MapPin,
  Brain,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Building,
  Activity,
  Shield,
  Database,
  Globe,
  Moon,
  Sun
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) => {
  const { user } = useAuth();

  const getRoleBasedMenu = (role) => {
    switch (role) {
      case 'student':
        return [
          { id: 'timetable', label: 'My Timetable', icon: Calendar, color: '#3b82f6' },
          { id: 'notifications', label: 'Notifications', icon: Bell, color: '#ef4444' },
          { id: 'attendance', label: 'Attendance', icon: CheckCircle, color: '#10b981' },
          { id: 'gaps', label: 'Study Gaps', icon: Clock, color: '#f59e0b' },
          { id: 'feedback', label: 'Feedback', icon: MessageSquare, color: '#8b5cf6' },
          { id: 'analytics', label: 'My Analytics', icon: BarChart3, color: '#06b6d4' }
        ];
      case 'faculty':
        return [
          { id: 'teaching', label: 'Teaching Schedule', icon: BookOpen, color: '#3b82f6' },
          { id: 'workload', label: 'Workload Analytics', icon: BarChart3, color: '#10b981' },
          { id: 'leave', label: 'Leave Management', icon: Clock, color: '#f59e0b' },
          { id: 'classes', label: 'Class Management', icon: Users, color: '#8b5cf6' },
          { id: 'suggestions', label: 'Smart Suggestions', icon: Brain, color: '#ef4444' },
          { id: 'analytics', label: 'Teaching Analytics', icon: TrendingUp, color: '#06b6d4' }
        ];
      case 'hod':
        return [
          { id: 'overview', label: 'Department Overview', icon: BarChart3, color: '#3b82f6' },
          { id: 'rooms', label: 'Room Utilization', icon: Building, color: '#10b981' },
          { id: 'approvals', label: 'Approval Queue', icon: CheckCircle, color: '#f59e0b' },
          { id: 'conflicts', label: 'Conflict Detection', icon: AlertTriangle, color: '#ef4444' },
          { id: 'insights', label: 'Predictive Insights', icon: Brain, color: '#8b5cf6' },
          { id: 'analytics', label: 'Department Analytics', icon: TrendingUp, color: '#06b6d4' }
        ];
      case 'admin':
        return [
          { id: 'users', label: 'User Management', icon: Users, color: '#3b82f6' },
          { id: 'classrooms', label: 'Classroom Allocation', icon: Building, color: '#10b981' },
          { id: 'analytics', label: 'System Analytics', icon: BarChart3, color: '#f59e0b' },
          { id: 'energy', label: 'Energy Efficiency', icon: Activity, color: '#ef4444' },
          { id: 'collaboration', label: 'Collaboration', icon: MessageSquare, color: '#8b5cf6' },
          { id: 'settings', label: 'System Settings', icon: Settings, color: '#06b6d4' }
        ];
      default:
        return [];
    }
  };

  const menuItems = getRoleBasedMenu(user?.role);

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} style={{
      width: isCollapsed ? '80px' : '280px',
      height: '100vh',
      background: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)',
      color: 'white',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 1000,
      transition: 'width 0.3s ease',
      boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div className="sidebar-header" style={{
        padding: '20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between'
      }}>
        {!isCollapsed && (
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Smart Timetable</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.8 }}>AI-Powered Scheduler</p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: 'white',
            padding: '8px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Settings size={16} />
        </button>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="user-info" style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>{user?.name}</div>
            <div style={{ fontSize: '12px', opacity: 0.8, textTransform: 'capitalize' }}>
              {user?.role} • {user?.department || 'System'}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="sidebar-nav" style={{ padding: '20px 0', flex: 1 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id} style={{ marginBottom: '4px' }}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                  style={{
                    width: '100%',
                    padding: isCollapsed ? '16px 20px' : '16px 20px',
                    background: activeTab === item.id ? 'rgba(255,255,255,0.15)' : 'transparent',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: isCollapsed ? '0' : '12px',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    transition: 'all 0.3s ease',
                    fontSize: '14px',
                    fontWeight: '500',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    if (activeTab !== item.id) {
                      e.target.style.background = 'rgba(255,255,255,0.1)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (activeTab !== item.id) {
                      e.target.style.background = 'transparent';
                    }
                  }}
                >
                  <IconComponent size={20} style={{ color: activeTab === item.id ? item.color : 'white' }} />
                  {!isCollapsed && <span>{item.label}</span>}
                  {activeTab === item.id && (
                    <div style={{
                      position: 'absolute',
                      right: '0',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '4px',
                      height: '20px',
                      background: item.color,
                      borderRadius: '2px'
                    }}></div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer" style={{
        padding: '20px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: isCollapsed ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px'
      }}>
        {!isCollapsed && (
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            Version 2.0.1
          </div>
        )}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: 'white',
            padding: '8px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Globe size={16} />
          </button>
          <button style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: 'white',
            padding: '8px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Moon size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
