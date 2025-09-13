import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = ({ 
  children, 
  isCollapsed = false, 
  width = 280,
  collapsedWidth = 80,
  className = '',
  style = {}
}) => {
  const { colors, typography, isDarkMode } = useTheme();
  const currentColors = colors[isDarkMode ? 'dark' : 'light'];

  const sidebarStyles = {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    width: isCollapsed ? collapsedWidth : width,
    background: currentColors.sidebar,
    color: currentColors.textLight,
    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 1000,
    boxShadow: currentColors.shadowElevated,
    fontFamily: typography.fontFamily,
    ...style
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .ui-sidebar {
            transform: translateX(-100%) !important;
            transition: transform 0.3s ease !important;
          }
          .ui-sidebar.ui-sidebar--mobile-open {
            transform: translateX(0) !important;
          }
          .ui-sidebar--collapsed {
            transform: translateX(-100%) !important;
          }
        }
      `}</style>
      <aside 
        className={`ui-sidebar ${isCollapsed ? 'ui-sidebar--collapsed' : ''} ${className}`}
        style={sidebarStyles}
      >
        {children}
      </aside>
    </>
  );
};

const SidebarHeader = ({ children, className = '', style = {} }) => {
  const { colors, spacing, typography, isDarkMode } = useTheme();
  const currentColors = colors[isDarkMode ? 'dark' : 'light'];

  return (
    <div 
      className={`ui-sidebar__header ${className}`}
      style={{
        padding: spacing.lg,
        borderBottom: `1px solid ${currentColors.divider}`,
        ...style
      }}
    >
      {children}
    </div>
  );
};

const SidebarContent = ({ children, className = '', style = {} }) => {
  const { spacing } = useTheme();

  return (
    <div 
      className={`ui-sidebar__content ${className}`}
      style={{
        padding: spacing.md,
        flex: 1,
        overflowY: 'auto',
        ...style
      }}
    >
      {children}
    </div>
  );
};

const SidebarFooter = ({ children, className = '', style = {} }) => {
  const { colors, spacing, isDarkMode } = useTheme();
  const currentColors = colors[isDarkMode ? 'dark' : 'light'];

  return (
    <div 
      className={`ui-sidebar__footer ${className}`}
      style={{
        padding: spacing.md,
        borderTop: `1px solid ${currentColors.divider}`,
        marginTop: 'auto',
        ...style
      }}
    >
      {children}
    </div>
  );
};

const SidebarItem = ({ 
  children, 
  icon, 
  label, 
  active = false, 
  onClick,
  className = '',
  style = {}
}) => {
  const { colors, spacing, typography, borderRadius, isDarkMode } = useTheme();
  const currentColors = colors[isDarkMode ? 'dark' : 'light'];

  const itemStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    padding: `${spacing.md} ${spacing.lg}`,
    marginBottom: spacing.xs,
    borderRadius: borderRadius.sm,
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    background: active ? currentColors.sidebarActive : 'transparent',
    color: active ? currentColors.textLight : currentColors.textMuted,
    fontSize: typography.fontSizes.body1,
    fontWeight: active ? typography.fontWeights.medium : typography.fontWeights.normal,
    position: 'relative',
    textTransform: 'none',
    letterSpacing: typography.letterSpacing.normal,
    ...style
  };

  if (active) {
    itemStyles.borderLeft = `3px solid ${currentColors.sidebarAccent}`;
  }

  const hoverStyles = {
    background: active ? currentColors.sidebarActive : currentColors.sidebarHover,
    color: currentColors.textLight
  };

  return (
    <div
      className={`ui-sidebar__item ${active ? 'ui-sidebar__item--active' : ''} ${className}`}
      style={itemStyles}
      onClick={onClick}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.background = hoverStyles.background;
        el.style.color = hoverStyles.color;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        if (active) {
          el.style.background = currentColors.sidebarActive;
          el.style.color = currentColors.textLight;
        } else {
          el.style.background = 'transparent';
          el.style.color = currentColors.textMuted;
        }
      }}
    >
      {icon && (
        <span style={{ display: 'flex', alignItems: 'center', minWidth: '20px' }}>
          {icon}
        </span>
      )}
      {label && (
        <span style={{ 
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {label}
        </span>
      )}
      {children}
    </div>
  );
};

Sidebar.Header = SidebarHeader;
Sidebar.Content = SidebarContent;
Sidebar.Footer = SidebarFooter;
Sidebar.Item = SidebarItem;

export default Sidebar;
