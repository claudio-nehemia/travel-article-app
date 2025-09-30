import React from 'react';
import { Card } from '../ui/Card';

interface ToastProps {
  message: string;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <Card className="p-4 bg-gray-800 text-white shadow-2xl">
        <p className="font-semibold">{message}</p>
      </Card>
    </div>
  );
};