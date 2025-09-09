import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const Button = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
  style = {},
  disabled = false,
  ...props 
}) => {
  const { colors, spacing, borderRadius, typography, isDarkMode } = useTheme();
  const currentColors = colors[isDarkMode ? 'dark' : 'light'];
  const [ripples, setRipples] = useState([]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: currentColors.primary,
          color: currentColors.textOnPrimary,
          border: 'none',
          boxShadow: currentColors.shadowCard,
          '&:hover': {
            background: currentColors.primaryHover,
            boxShadow: currentColors.shadowHover
          }
        };
      case 'secondary':
        return {
          background: currentColors.surface,
          color: currentColors.primary,
          border: `1px solid ${currentColors.primary}`,
          boxShadow: currentColors.shadowCard,
          '&:hover': {
            background: currentColors.primaryLight
          }
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: currentColors.text,
          border: 'none',
          '&:hover': {
            background: currentColors.borderLight
          }
        };
      case 'danger':
        return {
          background: currentColors.danger,
          color: currentColors.textLight,
          border: 'none',
          boxShadow: currentColors.shadowCard,
          '&:hover': {
            background: currentColors.dangerLight
          }
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: `${spacing.sm} ${spacing.md}`,
          fontSize: typography.fontSizes.body2,
          minHeight: '32px'
        };
      case 'md':
        return {
          padding: `${spacing.sm} ${spacing.lg}`,
          fontSize: typography.fontSizes.body1,
          minHeight: '40px'
        };
      case 'lg':
        return {
          padding: `${spacing.md} ${spacing.xl}`,
          fontSize: typography.fontSizes.h6,
          minHeight: '48px'
        };
      default:
        return {};
    }
  };

  const createRipple = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
      size
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  const handleClick = (e) => {
    if (disabled) return;
    createRipple(e);
  };

  const buttonStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: borderRadius.sm,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeights.medium,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    outline: 'none',
    textDecoration: 'none',
    opacity: disabled ? 0.6 : 1,
    position: 'relative',
    overflow: 'hidden',
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide,
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style
  };

  const iconElement = icon && (
    <span style={{ display: 'flex', alignItems: 'center' }}>
      {icon}
    </span>
  );

  return (
    <>
      <style>
        {`
          @keyframes ripple {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
        `}
      </style>
      <button
        className={`ui-button ui-button--${variant} ui-button--${size} ${className}`}
        style={buttonStyles}
        onClick={handleClick}
        disabled={disabled}
        {...props}
      >
        {icon && iconPosition === 'left' && iconElement}
        {children}
        {icon && iconPosition === 'right' && iconElement}
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              background: currentColors.ripple,
              transform: 'scale(0)',
              animation: 'ripple 0.6s linear',
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              pointerEvents: 'none'
            }}
          />
        ))}
      </button>
    </>
  );
};

export default Button;
