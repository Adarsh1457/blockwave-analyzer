
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check for user token in localStorage on startup
    const storedUser = localStorage.getItem('crypto_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('crypto_user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in a real app, you would call an API
    if (email && password) {
      // For demo purposes, create a mock user
      const mockUser = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
      };
      
      // Store user in localStorage
      localStorage.setItem('crypto_user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setIsAuthenticated(true);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (email: string, password: string, name: string) => {
    // Mock registration - in a real app, you would call an API
    if (email && password && name) {
      // For demo purposes, create a mock user
      const mockUser = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email,
        name,
      };
      
      // Store user in localStorage
      localStorage.setItem('crypto_user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setIsAuthenticated(true);
    } else {
      throw new Error('Invalid registration details');
    }
  };

  const logout = () => {
    // Remove user from localStorage
    localStorage.removeItem('crypto_user');
    
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
