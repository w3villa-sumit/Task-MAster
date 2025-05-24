import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, ClipboardList, Plus } from 'lucide-react';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a 
              href="/" 
              className="flex items-center text-blue-600 font-bold text-xl"
            >
              <ClipboardList className="h-6 w-6 mr-2" />
              <span>TaskMaster</span>
            </a>
          </div>
          
          {state.isAuthenticated && (
            <div className="flex items-center space-x-4">
              <Button
                size="sm"
                variant="primary"
                onClick={() => navigate('/tasks/new')}
                className="hidden sm:flex"
              >
                <Plus className="h-4 w-4 mr-1" />
                New Task
              </Button>
              
              <div className="flex items-center">
                <div className="mr-3">
                  <p className="text-sm font-medium text-gray-700">
                    {state.user?.name}
                  </p>
                  <p className="text-xs text-gray-500">{state.user?.email}</p>
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => logout()}
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="ml-1 hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;