import React from 'react';

interface TextareaProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  rows?: number;
}

export const Textarea: React.FC<TextareaProps> = ({ 
  placeholder, 
  value, 
  onChange, 
  error, 
  rows = 4 
}) => {
  return (
    <div className="w-full">
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`w-full px-4 py-3 rounded-xl border-2 ${
          error ? 'border-red-500' : 'border-gray-200'
        } focus:border-purple-500 focus:outline-none transition-colors resize-none`}
      />
      {error && <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>}
    </div>
  );
};