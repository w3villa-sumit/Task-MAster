import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header';
import { ClipboardList } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, requireAuth = false }) => {
  const { state } = useAuth();
  
  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // If authentication is required and user is not authenticated, redirect to login
  if (requireAuth && !state.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If user is authenticated and trying to access login/register pages, redirect to dashboard
  if (state.isAuthenticated && !requireAuth) {
    return <Navigate to="/dashboard" />;
  }
  
  if (requireAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <a href="/" className="flex items-center text-blue-600 font-bold text-2xl">
            <ClipboardList className="h-8 w-8 mr-2" />
            <span>TaskMaster</span>
          </a>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;