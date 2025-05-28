'use client';

import { useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import styles from './auth.module.css';

export default function LoginForm() {
  const { login, message, error, clearMessages } = useAuth();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages(); 
    await login(username, password);
  };

  return (
    <div className={styles.formCard}>
      {message && <p className="message">{message}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}> 
        <label htmlFor="loginUsername" className={styles.label}>Username:</label>
        <input
          type="text"
          id="loginUsername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={styles.input}
        />
        <label htmlFor="loginPassword" className={styles.label}>Password:</label>
        <input
          type="password"
          id="loginPassword"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input} 
        />
        <button type="submit" className={styles.button}>Login</button>
      </form>
    </div>
  );
}