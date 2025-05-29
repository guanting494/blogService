'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';





export default function Header() {
  const router = useRouter();
  const { isAuthenticated, username, logout } = useAuth();
  console.log('Header rendered:', { isAuthenticated, username });
  return (
    <header className="bg-gray-800 text-white py-2 px-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-lg font-semibold hover:underline">
            Homepage
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="text-sm">Welcome, {username}!</span>
              <Link href="/" className="text-sm hover:underline">
                Blog
              </Link>
              <Link href="/" className="text-sm hover:underline">
                Profile
              </Link>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded"
                onClick={() => router.push('/user/login')}
              >
                Login
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded"
                onClick={() => router.push('/user/signup')}
              >
                Signup
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}