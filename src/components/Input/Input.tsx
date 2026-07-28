import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`input-group ${error ? 'has-error' : ''} ${className}`}>
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label} {props.required && <span className="required-star">*</span>}
          </label>
        )}
        <div className="input-wrapper">
          {leftIcon && <span className="input-icon left">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={`custom-input ${leftIcon ? 'with-left-icon' : ''} ${
              rightIcon ? 'with-right-icon' : ''
            }`}
            {...props}
          />
          {rightIcon && <span className="input-icon right">{rightIcon}</span>}
        </div>
        {error && <p className="input-error-msg">{error}</p>}
        {!error && helperText && <p className="input-helper-msg">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
