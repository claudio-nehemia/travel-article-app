import React from 'react';

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  icon 
}) => {
  return (
    <div className="w-full">
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full px-4 ${icon ? 'pl-12' : ''} py-3 rounded-xl border-2 ${
            error ? 'border-red-500' : 'border-gray-200'
          } focus:border-purple-500 focus:outline-none transition-colors`}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>}
    </div>
  );
};