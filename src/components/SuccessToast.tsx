import { useEffect } from 'react';
import './SuccessToast.css';

interface SuccessToastProps {
  message: string;
  onClose: () => void;
}

const SuccessToast = ({ message, onClose }: SuccessToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="success-toast">
      <div className="toast-icon">✅</div>
      <div className="toast-message">{message}</div>
    </div>
  );
};

export default SuccessToast;