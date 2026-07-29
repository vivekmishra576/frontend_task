import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import './Toast.css';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="toast-container">
      <div className="toast-content">
        <CheckCircle2 size={20} color="#10b981" />
        <span className="toast-message">{message}</span>
        <button className="toast-close-btn" onClick={onClose}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
