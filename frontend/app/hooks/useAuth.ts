'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, signupUser, logoutUser, githubSocialLogin } from '@/app/lib/userApi';
interface AuthState {
  authToken: string | null;
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  loginWithGithub: (code: string) => Promise<void>;
  signup: (username: string, email: string, password: string, passwordConfirm: string) => Promise<void>;
  logout: () => Promise<void>;
  message: string;
  error: string;
  clearMessages: () => void;
}

export const useAuth = (): AuthState => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  // use useCallback to avoid recreating functions on every render
  const clearMessages = useCallback(() => {
    setMessage('');
    setError('');
  }, []);

  // check if the user is authenticated based on the presence of a token
  useEffect(() => {
    if (typeof window !== 'undefined') { // confirm in a browser environment
      const storedToken = localStorage.getItem('authToken');
      const storedUsername = localStorage.getItem('authUsername');
      if (storedToken) {
        setAuthToken(storedToken);
        setIsAuthenticated(true);
        setUsername(storedUsername || null);
        setMessage('load authToken from localStorage');
      }
    }
  }, []);

  const login = useCallback(async (user: string, pass: string) => {
    clearMessages();
    try {
      const data = await loginUser(user, pass);
      const token = data.key; // DRF Token
      if (token) {
        setAuthToken(token);
        localStorage.setItem('authToken', token);
        localStorage.setItem('authUsername', user);
        setIsAuthenticated(true);
        setUsername(user);
        router.push('/'); // Redirect to the main page after login
      } else {
        setError('login failed! unauthorized');
      }
    } catch (err: any) {
      setError(`login faild: ${err.message || 'unknown error'}`);
      console.error('Login error:', err);
    }
  }, [clearMessages, router]);

  const loginWithGithub = useCallback(async (code: string) => {
    clearMessages();
    try {
      const data = await githubSocialLogin(code);
      const token = data.key || data.access;
      // TODO： need to ajust the response structure based on backend implementation
      const usernameFromResponse = data.user?.username || data.username || 'GitHub用户';

      if (token) {
        setAuthToken(token);
        localStorage.setItem('authToken', token);
        localStorage.setItem('authUsername', usernameFromResponse); 
        setIsAuthenticated(true);
        setUsername(usernameFromResponse);
        setMessage('GitHub login successful!');
      } else {
        setError('GitHub login failed! unauthorized');
      }
    } catch (err: any) {
      setError(`GitHub login faild: ${err.message || 'unknown error'}`);
      console.error('GitHub login error:', err);
    }
  }, [clearMessages]);

  const signup = useCallback(async (user: string, email: string, pass: string, passConfirm: string) => {
    clearMessages();
    try {
      const data = await signupUser(user, email, pass, passConfirm);
      const token = data.key;
      if (token) {
        setAuthToken(token);
        localStorage.setItem('authToken', token);
        localStorage.setItem('authUsername', user);
        setIsAuthenticated(true);
        setUsername(user);
        setMessage('signup and login successful!');
      } else {
        setError('signup failed! unauthorized');
      }
    } catch (err: any) {
      setError(`signup failed: ${err.message || 'unknown error'}`);
      console.error('Signup error:', err);
    }
  }, [clearMessages]);

  const logout = useCallback(async () => {
    clearMessages();
    if (!authToken) {
      setAuthToken(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUsername');
      setIsAuthenticated(false);
      setUsername(null);
      setMessage('logout successful, but no authToken found.');
      return;
    }
    try {
      const data = await logoutUser(authToken);
      setAuthToken(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUsername');
      setIsAuthenticated(false);
      setUsername(null);
      setMessage(data.detail || 'logout successful');
    } catch (err: any) {
      // even if the backend returns an error (like 401),
      setAuthToken(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUsername');
      setIsAuthenticated(false);
      setUsername(null);
      setError(`logout failed: ${err.message || 'unknown error'}, but authToken cleared.`);
      console.error('Logout error:', err);
    }
  }, [authToken, clearMessages]);

  return {
    authToken,
    isAuthenticated,
    username,
    login,
    loginWithGithub,
    signup,
    logout,
    message,
    error,
    clearMessages,
  };
};