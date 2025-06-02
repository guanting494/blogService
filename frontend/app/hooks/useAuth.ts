'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, signupUser, logoutUser, githubSocialLogin } from '@/app/lib/userApi';
import { useAuthContext } from '@/app/providers/AuthProvider';

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
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { isAuthenticated, username, authToken, setAuth } = useAuthContext();

  const clearMessages = useCallback(() => {
    setMessage('');
    setError('');
  }, []);

  const login = useCallback(async (user: string, pass: string) => {
    clearMessages();
    try {
      const data = await loginUser(user, pass);
      const token = data.key;
      if (token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('authUsername', user);
        setAuth(true, user, token);
        router.push('/');
      } else {
        setError('login failed! unauthorized');
      }
    } catch (err: any) {
      setError(`login failed: ${err.message || 'unknown error'}`);
      console.error('Login error:', err);
    }
  }, [clearMessages, router, setAuth]);

  const loginWithGithub = useCallback(async (code: string) => {
    clearMessages();
    try {
      const data = await githubSocialLogin(code);
      console.log('GitHub login response:', data);
      if (data.key) {
        localStorage.setItem('authToken', data.key);
        if (data.user?.username) {
          localStorage.setItem('authUsername', data.user.username);
          setAuth(true, data.user.username, data.key);
        }
        setMessage('Successfully logged in with GitHub!');
        router.push('/');
      } else {
        throw new Error('No authentication token received');
      }
    } catch (err: any) {
      console.error('GitHub login error:', err);
      setError(err.message || 'Failed to login with GitHub');
      router.push('/user/login?error=' + encodeURIComponent(err.message || 'Failed to login with GitHub'));
    }
  }, [clearMessages, router, setAuth]);

  const signup = useCallback(async (user: string, email: string, pass: string, passConfirm: string) => {
    clearMessages();
    try {
      const data = await signupUser(user, email, pass, passConfirm);
      const token = data.key;
      if (token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('authUsername', user);
        setAuth(true, user, token);
        setMessage('signup and login successful!');
      } else {
        setError('signup failed! unauthorized');
      }
    } catch (err: any) {
      setError(`signup failed: ${err.message || 'unknown error'}`);
      console.error('Signup error:', err);
    }
  }, [clearMessages, setAuth]);

  const logout = useCallback(async () => {
    clearMessages();
    try {
      if (authToken) {
        await logoutUser(authToken);
      }
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUsername');
      setAuth(false, null, null);
      setMessage('logout successful');
    } catch (err: any) {
      console.error('Logout error:', err);
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUsername');
      setAuth(false, null, null);
      setError(`logout failed: ${err.message || 'unknown error'}`);
    }
  }, [authToken, clearMessages, setAuth]);

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