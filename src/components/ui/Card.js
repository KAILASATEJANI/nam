import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Card = ({ 
  children, 
  className = '', 
  padding = 'lg', 
  shadow = 'card',
  hover = false,
  style = {},
  ...props 
}) => {
  const { colors, spacing, borderRadius, isDarkMode } = useTheme();
  const currentColors = colors[isDarkMode ? 'dark' : 'light'];

  const cardStyles = {
    background: currentColors.card,
    borderRadius: borderRadius.sm,
    padding: spacing[padding] || padding,
    boxShadow: currentColors[`shadow${shadow.charAt(0).toUpperCase() + shadow.slice(1)}`] || currentColors.shadowCard,
    border: 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    ...style
  };

  if (hover) {
    cardStyles[':hover'] = {
      boxShadow: currentColors.shadowHover,
      transform: 'translateY(-2px)'
    };
  }

  return (
    <div 
      className={`ui-card ${className}`}
      style={cardStyles}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
