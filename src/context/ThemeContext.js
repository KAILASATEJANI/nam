import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => {
    console.log('Theme toggle called! Current mode:', isDarkMode, 'Switching to:', !isDarkMode);
    setIsDarkMode(!isDarkMode);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      // Light Mode Colors - Material Design
      light: {
        // Primary Colors - Material Design Purple
        primary: '#6200EE',
        primaryHover: '#7C4DFF',
        primaryLight: '#E1BEE7',
        primaryDark: '#3700B3',
        
        // Secondary Colors
        secondary: '#BB86FC',
        secondaryHover: '#D1C4E9',
        secondaryLight: '#F3E5F5',
        
        // Accent Colors
        accent: '#03DAC6',
        accentHover: '#18FFFF',
        accentLight: '#B2DFDB',
        
        // Background Colors
        background: '#F5F5F5',
        surface: '#FFFFFF',
        card: '#FFFFFF',
        cardHover: '#FAFAFA',
        
        // Text Colors
        text: '#212121',
        textSecondary: '#555555',
        textMuted: '#9E9E9E',
        textLight: '#FFFFFF',
        textOnPrimary: '#FFFFFF',
        
        // Border & Divider Colors
        border: '#E0E0E0',
        borderLight: '#F5F5F5',
        divider: '#E0E0E0',
        
        // Status Colors
        success: '#4CAF50',
        successLight: '#C8E6C9',
        warning: '#FF9800',
        warningLight: '#FFE0B2',
        danger: '#F44336',
        dangerLight: '#FFCDD2',
        info: '#2196F3',
        infoLight: '#BBDEFB',
        
        // Sidebar Specific
        sidebar: '#212121',
        sidebarActive: '#6200EE',
        sidebarHover: '#424242',
        sidebarAccent: '#BB86FC',
        
        // Material Design Shadows
        shadow: '0 2px 4px rgba(0,0,0,0.1)',
        shadowHover: '0 4px 8px rgba(0,0,0,0.15)',
        shadowCard: '0 1px 3px rgba(0,0,0,0.12)',
        shadowElevated: '0 8px 16px rgba(0,0,0,0.15)',
        
        // Material Design Properties
        ripple: 'rgba(98, 0, 238, 0.12)',
        focus: 'rgba(98, 0, 238, 0.2)',
        disabled: '#BDBDBD'
      },
      // Dark Mode Colors - Material Design Dark
      dark: {
        // Primary Colors - Material Design Purple
        primary: '#BB86FC',
        primaryHover: '#D1C4E9',
        primaryLight: '#E1BEE7',
        primaryDark: '#6200EE',
        
        // Secondary Colors
        secondary: '#03DAC6',
        secondaryHover: '#18FFFF',
        secondaryLight: '#B2DFDB',
        
        // Accent Colors
        accent: '#FF6B6B',
        accentHover: '#FF8A80',
        accentLight: '#FFCDD2',
        
        // Background Colors
        background: '#121212',
        surface: '#1E1E1E',
        card: '#2C2C2C',
        cardHover: '#3C3C3C',
        
        // Text Colors
        text: '#FFFFFF',
        textSecondary: '#B3B3B3',
        textMuted: '#757575',
        textLight: '#FFFFFF',
        textOnPrimary: '#000000',
        
        // Border & Divider Colors
        border: '#424242',
        borderLight: '#2C2C2C',
        divider: '#424242',
        
        // Status Colors
        success: '#4CAF50',
        successLight: '#2E7D32',
        warning: '#FF9800',
        warningLight: '#F57C00',
        danger: '#F44336',
        dangerLight: '#D32F2F',
        info: '#2196F3',
        infoLight: '#1976D2',
        
        // Sidebar Specific
        sidebar: '#000000',
        sidebarActive: '#BB86FC',
        sidebarHover: '#1C1C1C',
        sidebarAccent: '#03DAC6',
        
        // Material Design Shadows
        shadow: '0 2px 4px rgba(0,0,0,0.3)',
        shadowHover: '0 4px 8px rgba(0,0,0,0.4)',
        shadowCard: '0 1px 3px rgba(0,0,0,0.2)',
        shadowElevated: '0 8px 16px rgba(0,0,0,0.3)',
        
        // Material Design Properties
        ripple: 'rgba(187, 134, 252, 0.12)',
        focus: 'rgba(187, 134, 252, 0.2)',
        disabled: '#616161'
      }
    },
    // Typography - Material Design
    typography: {
      fontFamily: "'Roboto', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSizes: {
        caption: '12px',
        body2: '14px',
        body1: '16px',
        subtitle2: '14px',
        subtitle1: '16px',
        h6: '20px',
        h5: '24px',
        h4: '34px',
        h3: '48px',
        h2: '60px',
        h1: '96px'
      },
      fontWeights: {
        light: 300,
        normal: 400,
        medium: 500,
        bold: 700
      },
      lineHeights: {
        tight: 1.2,
        normal: 1.4,
        relaxed: 1.6
      },
      letterSpacing: {
        tight: '-0.5px',
        normal: '0px',
        wide: '0.5px'
      }
    },
    // Spacing - Material Design
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      '2xl': '48px',
      '3xl': '64px',
      '4xl': '96px'
    },
    // Border Radius - Material Design
    borderRadius: {
      xs: '4px',
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '20px',
      full: '9999px'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
