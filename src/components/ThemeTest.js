import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeTest = () => {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const currentColors = isDarkMode ? colors.dark : colors.light;

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: currentColors.card,
      border: `2px solid ${currentColors.border}`,
      borderRadius: '8px',
      padding: '10px',
      color: currentColors.text,
      fontSize: '12px',
      zIndex: 9999,
      minWidth: '200px'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
        Theme Test Component
      </div>
      <div>Current Mode: {isDarkMode ? 'Dark' : 'Light'}</div>
      <div>Background: {currentColors.background}</div>
      <div>Card: {currentColors.card}</div>
      <div>Text: {currentColors.text}</div>
      <button 
        onClick={toggleTheme}
        style={{
          marginTop: '5px',
          padding: '5px 10px',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Toggle Theme
      </button>
    </div>
  );
};

export default ThemeTest;
