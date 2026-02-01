/**
 * Select dropdown component
 */

import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  fullWidth?: boolean;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, helperText, options, fullWidth = false, placeholder, className = '', ...props },
    ref
  ) => {
    const selectId = props.id || props.name || `select-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    const selectClasses = `
      block w-full px-3 py-2 border rounded-lg shadow-sm
      focus:outline-none focus:ring-2 focus:ring-offset-0
      disabled:opacity-50 disabled:cursor-not-allowed
      dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100
      ${
        hasError
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-400'
          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400'
      }
      ${className}
    `;

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        <select ref={ref} id={selectId} className={selectClasses} {...props}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';