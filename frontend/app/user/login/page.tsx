'use client';
import LoginForm from '@/app/components/auth/LoginForm';
import { useAuth } from '@/app/hooks/useAuth';
import styles from '@/app/components/auth/auth.module.css';
import Link from 'next/link';


export default function LoginPage() {
  const { isAuthenticated, message, error } = useAuth();
  const GITHUB_CLIENT_ID = 'Ov23liU7LUflMX0TfTsN';
  const GITHUB_REDIRECT_URI = 'http://localhost:8000/users/accounts/github/login/callback/';

  const GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=user:email`;
    const handleGithubLogin = () => {
    window.location.href = GITHUB_AUTH_URL; // 重定向用户到 GitHub 授权页面
  };

  return (
    <div className="container">
      <main className="main">
        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}

        {isAuthenticated ? (
          <div className="flex flex-col items-center">
            <p className="text-lg font-semibold text-green-600 mb-4">You are already logged in!</p>
            <Link href="/" className="text-blue-500 hover:underline text-lg">
              Go to Homepage
            </Link>
          </div>
        ) : (
          <div className={styles.loginBox}>
            <LoginForm />
            <button
              onClick={handleGithubLogin}
              className={styles.githubButton + ' ' + styles.fullWidth}
            >
              Login with GitHub
            </button>
          </div>
        )}

      </main>
    </div>
  );
}