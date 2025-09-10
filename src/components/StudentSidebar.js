import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import Sidebar from './ui/Sidebar';
import { 
  Calendar, 
  Bell, 
  BarChart3, 
  CheckCircle, 
  Clock, 
  MessageSquare,
  Settings,
  Globe,
  CreditCard,
  BookOpen,
  Users,
  GraduationCap
} from 'lucide-react';

const StudentSidebar = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) => {
  const { user } = useAuth();
  const { isDarkMode, colors, typography } = useTheme();
  const currentColors = isDarkMode ? colors.dark : colors.light;
  const navigate = useNavigate();
  
  const menuItems = [
    { id: 'timetable', label: 'My Timetable', icon: Calendar, color: '#4A90E2' },
    { id: 'attendance', label: 'Attendance', icon: CheckCircle, color: '#28A745' },
    { id: 'assignments', label: 'Assignments', icon: BookOpen, color: '#FFC107' },
    { id: 'fees', label: 'My Fees', icon: CreditCard, color: '#17A2B8' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: '#DC3545' },
    { id: 'analytics', label: 'My Analytics', icon: BarChart3, color: '#6F42C1' },
    { id: 'gaps', label: 'Study Gaps', icon: Clock, color: '#FD7E14' },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, color: '#20C997' }
  ];

  return (
    <Sidebar isCollapsed={isCollapsed} width={280} collapsedWidth={80}>
      <Sidebar.Header>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          marginBottom: '8px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: currentColors.primary,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: currentColors.textLight,
            fontSize: '18px',
            fontWeight: typography.fontWeights.bold
          }}>
            <GraduationCap size={24} />
          </div>
          {!isCollapsed && (
            <div>
              <div style={{ 
                fontSize: typography.fontSizes.lg, 
                fontWeight: typography.fontWeights.bold,
                color: currentColors.textLight,
                marginBottom: '2px'
              }}>
                SCHOOL
              </div>
              <div style={{ 
                fontSize: typography.fontSizes.xs, 
                color: currentColors.textMuted,
                opacity: 0.8
              }}>
                Student Portal
              </div>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <div style={{ 
            fontSize: typography.fontSizes.sm, 
            color: currentColors.textMuted,
            padding: '8px 12px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '6px',
            marginTop: '8px'
          }}>
            Welcome back, {user?.name || 'Student'}!
          </div>
        )}
      </Sidebar.Header>

      <Sidebar.Content>
        <div style={{ marginBottom: '16px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Sidebar.Item
                key={item.id}
                icon={<Icon size={20} style={{ color: activeTab === item.id ? currentColors.sidebarAccent : 'currentColor' }} />}
                label={!isCollapsed ? item.label : ''}
                active={activeTab === item.id}
                onClick={() => {
                  if (item.id === 'fees') {
                    navigate('/student/fees');
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                style={{
                  marginBottom: '4px',
                  position: 'relative'
                }}
              />
            );
          })}
        </div>
      </Sidebar.Content>

      <Sidebar.Footer>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: isCollapsed ? 'center' : 'space-between',
          gap: '8px'
        }}>
          {!isCollapsed && (
            <div style={{ 
              fontSize: typography.fontSizes.xs, 
              color: currentColors.textMuted,
              opacity: 0.8
            }}>
              Student v2.0
            </div>
          )}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: currentColors.textMuted,
              padding: '8px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)';
              e.target.style.color = currentColors.textLight;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.1)';
              e.target.style.color = currentColors.textMuted;
            }}
            >
              <Globe size={16} />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </Sidebar.Footer>
    </Sidebar>
  );
};

export default StudentSidebar;