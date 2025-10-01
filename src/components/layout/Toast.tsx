import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { Card } from '../ui/Card';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  if (!message) return null;

  const styles = {
    success: {
      bg: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      icon: CheckCircle,
      iconColor: 'text-white'
    },
    error: {
      bg: 'bg-gradient-to-r from-red-500 to-rose-600',
      icon: AlertCircle,
      iconColor: 'text-white'
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      icon: Info,
      iconColor: 'text-white'
    }
  };

  const { bg, icon: Icon, iconColor } = styles[type];

  return (
    <div className="fixed top-6 right-6 z-50 animate-fade-in max-w-md">
      <Card className={`${bg} text-white shadow-2xl border-0 p-4`}>
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
          <p className="font-medium text-sm flex-1 leading-relaxed">{message}</p>
          {onClose && (
            <button
              onClick={onClose}
              className="flex-shrink-0 hover:bg-white/20 rounded p-1 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};