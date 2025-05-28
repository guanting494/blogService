'use client';

import { useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import styles from './auth.module.css';

export default function SignupForm() {
  const { signup, message, error, clearMessages } = useAuth();

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    await signup(username, email, password, passwordConfirm);
  };

  return (
    <div className={styles.formCard}>
      <h2 className={styles.subtitle}>Signup</h2>
      {message && <p className="message">{message}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="signupUsername" className={styles.label}>Username:</label>
        <input
          type="text"
          id="signupUsername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={styles.input}
        />
        <label htmlFor="signupEmail" className={styles.label}>Email:</label>
        <input
          type="email"
          id="signupEmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <label htmlFor="signupPassword" className={styles.label}>Password:</label>
        <input
          type="password"
          id="signupPassword"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        <label htmlFor="signupPasswordConfirm" className={styles.label}>Confirm Password:</label>
        <input
          type="password"
          id="signupPasswordConfirm"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Signup</button>
      </form>
    </div>
  );
}