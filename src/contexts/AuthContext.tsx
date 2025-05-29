
import React, { createContext, useContext, useState, useEffect } from 'react';
import { localStorageUtils } from '../utils/localStorageUtils';

export interface User {
  id: string;
  email: string;
  role: 'Admin' | 'Inspector' | 'Engineer';
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
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

  useEffect(() => {
    const savedUser = localStorageUtils.getUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const users = localStorageUtils.getUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userWithoutPassword = {
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
        name: foundUser.name
      };
      setUser(userWithoutPassword);
      localStorageUtils.setUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorageUtils.removeUser();
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
