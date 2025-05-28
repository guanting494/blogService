'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import AuthStatus from '@/app/components/auth/AuthStatus';
import styles from '@/app/components/auth/auth.module.css';

const LOGIN_PATH = '/user/login';
const SIGNUP_PATH = '/user/signup';

export default function UserPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <AuthStatus />;
  }

  return (
    <div className="container">
      <main className="main">
        <h1 className="title">Welcome!</h1>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            className={styles.button}
            onClick={() => router.push(LOGIN_PATH)}
          >
            Login
          </button>
          <button
            className={styles.button}
            onClick={() => router.push(SIGNUP_PATH)}
          >
            Signup
          </button>
        </div>
      </main>
    </div>
  );
}