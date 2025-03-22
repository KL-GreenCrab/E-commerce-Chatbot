import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const savedAuth = localStorage.getItem('auth');
    return savedAuth ? JSON.parse(savedAuth) : { user: null, token: null };
  });

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(authState));
  }, [authState]);

  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call
    if (email === 'demo@example.com' && password === 'password') {
      const user = {
        id: '1',
        email,
        name: 'Demo User'
      };
      setAuthState({ user, token: 'demo-token' });
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // In a real app, this would make an API call
    const user = {
      id: Date.now().toString(),
      email,
      name
    };
    setAuthState({ user, token: 'demo-token' });
  };

  const logout = () => {
    setAuthState({ user: null, token: null });
  };

  return (
    <AuthContext.Provider value={{ user: authState.user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}