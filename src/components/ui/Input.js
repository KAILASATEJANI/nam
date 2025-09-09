import React, { useState, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

const Input = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled = false,
  error = false,
  helperText,
  required = false,
  className = '',
  style = {},
  ...props
}) => {
  const { colors, spacing, borderRadius, typography, isDarkMode } = useTheme();
  const currentColors = colors[isDarkMode ? 'dark' : 'light'];
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const isFloating = focused || value || placeholder;

  const containerStyles = {
    position: 'relative',
    marginBottom: spacing.md,
    ...style
  };

  const inputStyles = {
    width: '100%',
    padding: `${spacing.lg} ${spacing.md} ${spacing.sm} ${spacing.md}`,
    border: `1px solid ${error ? currentColors.danger : currentColors.border}`,
    borderRadius: borderRadius.sm,
    fontSize: typography.fontSizes.body1,
    fontFamily: typography.fontFamily,
    background: currentColors.surface,
    color: currentColors.text,
    outline: 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:focus': {
      borderColor: currentColors.primary,
      boxShadow: `0 0 0 2px ${currentColors.focus}`
    },
    '&:disabled': {
      background: currentColors.borderLight,
      color: currentColors.disabled,
      cursor: 'not-allowed'
    }
  };

  const labelStyles = {
    position: 'absolute',
    left: spacing.md,
    color: error ? currentColors.danger : (focused ? currentColors.primary : currentColors.textMuted),
    fontSize: isFloating ? typography.fontSizes.body2 : typography.fontSizes.body1,
    fontWeight: typography.fontWeights.medium,
    transform: isFloating ? 'translateY(-8px) scale(0.75)' : 'translateY(12px) scale(1)',
    transformOrigin: 'left top',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'none',
    background: currentColors.surface,
    padding: '0 4px',
    zIndex: 1
  };

  const helperTextStyles = {
    fontSize: typography.fontSizes.body2,
    color: error ? currentColors.danger : currentColors.textMuted,
    marginTop: spacing.xs,
    marginLeft: spacing.md
  };

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  return (
    <div className={`ui-input ${className}`} style={containerStyles}>
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          style={inputStyles}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {label && (
          <label style={labelStyles}>
            {label}
            {required && <span style={{ color: currentColors.danger }}> *</span>}
          </label>
        )}
      </div>
      {helperText && (
        <div style={helperTextStyles}>
          {helperText}
        </div>
      )}
    </div>
  );
};

export default Input;
