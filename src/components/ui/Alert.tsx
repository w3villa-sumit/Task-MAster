import React, { HTMLAttributes, ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
}

const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  className = '',
  ...props
}) => {
  const variantClasses = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200',
  };

  const variantIcon = {
    info: <Info className="h-5 w-5 text-blue-500" />,
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
  };

  return (
    <div
      className={`flex items-start p-4 border rounded-md ${variantClasses[variant]} ${className}`}
      role="alert"
      {...props}
    >
      <div className="flex-shrink-0 mr-3">{variantIcon[variant]}</div>
      <div>{children}</div>
    </div>
  );
};

export default Alert;