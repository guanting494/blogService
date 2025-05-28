'use client';

import { useAuth } from '@/app/hooks/useAuth';
import styles from './auth.module.css'; // 导入 CSS Modules

export default function AuthStatus() {
  const { isAuthenticated, username, logout, message, error } = useAuth();

  if (!isAuthenticated) {
    return null; // if unauthenticated, do not render anything
  }

  return (
    <div className={styles.authSection}>
      {message && <p className="message">{message}</p>}
      {error && <p className="error">{error}</p>}
      <p>Welcome**{username || 'user'}**! you have already logined</p>
      <button onClick={logout} className={styles.button}>logout</button>
    </div>
  );
}