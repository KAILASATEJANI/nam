import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import Sidebar from './ui/Sidebar';
import { 
  Users, 
  Building, 
  BarChart3, 
  Activity, 
  MessageSquare, 
  Settings, 
  CreditCard,
  Shield,
  Database,
  Cog
} from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) => {
  const { user } = useAuth();
  const { isDarkMode, colors, typography } = useTheme();
  const currentColors = isDarkMode ? colors.dark : colors.light;
  
  const menuItems = [
    { id: 'users', label: 'Users', icon: Users, color: '#4A90E2' },
    { id: 'classrooms', label: 'Classrooms', icon: Building, color: '#28A745' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: '#FFC107' },
    { id: 'energy', label: 'Energy', icon: Activity, color: '#17A2B8' },
    { id: 'fees', label: 'Fee Management', icon: CreditCard, color: '#DC3545' },
    { id: 'collaboration', label: 'Collaboration', icon: MessageSquare, color: '#6F42C1' },
    { id: 'settings', label: 'Settings', icon: Settings, color: '#8A9BA8' }
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
            <Cog size={24} />
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
                Admin Portal
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
            Welcome, {user?.name || 'Admin'}!
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
                onClick={() => setActiveTab(item.id)}
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
              Admin v2.0
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
              <Database size={16} />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </Sidebar.Footer>
    </Sidebar>
  );
};

export default AdminSidebar;