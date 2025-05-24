import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, User } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { getUserByEmail, saveUser } from '../utils/localStorage';

// Define action types
type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

// Create context
const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
} | undefined>(undefined);

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Create provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: JSON.parse(storedUser) });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // In a real app, you'd make an API call to verify credentials
    const storedPasswords = localStorage.getItem('passwords') || '{}';
    const passwords = JSON.parse(storedPasswords);
    
    const user = getUserByEmail(email);
    
    if (user && passwords[email] === password) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } else {
      throw new Error('Invalid email or password');
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Check if user already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw new Error('User already exists');
    }
    
    // Create new user
    const newUser: User = {
      id: uuidv4(),
      email,
      name,
    };
    
    // Store user
    saveUser(newUser);
    
    // Store password (in a real app, you'd hash this on the server)
    const storedPasswords = localStorage.getItem('passwords') || '{}';
    const passwords = JSON.parse(storedPasswords);
    passwords[email] = password;
    localStorage.setItem('passwords', JSON.stringify(passwords));
    
    // Set current user
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    dispatch({ type: 'REGISTER_SUCCESS', payload: newUser });
  };

  // Logout function
  const logout = (): void => {
    localStorage.removeItem('currentUser');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};