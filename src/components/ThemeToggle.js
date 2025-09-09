import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ style = {} }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const handleToggle = () => {
    console.log('Theme toggle clicked! Current mode:', isDarkMode);
    toggleTheme();
  };

  return (
    <button
      onClick={handleToggle}
      style={{
        background: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
        border: 'none',
        color: isDarkMode ? 'white' : '#1f2937',
        padding: '8px',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        minWidth: '32px',
        minHeight: '32px',
        ...style
      }}
      title={isDarkMode ? 'Switch to Light Mode (Day)' : 'Switch to Dark Mode (Night)'}
    >
      {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};

export default ThemeToggle;
