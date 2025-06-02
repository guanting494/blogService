'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  authToken: string | null;
  setAuth: (isAuthenticated: boolean, username: string | null, token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('authUsername');
    if (storedToken) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
      setAuthToken(storedToken);
    }
  }, []);

  const setAuth = (isAuthenticated: boolean, username: string | null, token: string | null) => {
    setIsAuthenticated(isAuthenticated);
    setUsername(username);
    setAuthToken(token);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, authToken, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
