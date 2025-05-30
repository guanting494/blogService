'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';

function GitHubCallbackContent() {
  const searchParams = useSearchParams();
  const { loginWithGithub } = useAuth();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      handleGitHubCallback(code);
    }
  }, [searchParams]);

  const handleGitHubCallback = async (code: string) => {
    try {
      await loginWithGithub(code);
    } catch (error) {
      console.error('GitHub login failed:', error);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl font-bold mb-4">Login...</h1>
        <p className="text-gray-600">Processing GitHub login...</p>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function LoadingCallback() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl font-bold mb-4">Loading...</h1>
        <p className="text-gray-600">Please wait...</p>
      </div>
    </div>
  );
}

export default function GitHubCallback() {
  return (
    <Suspense fallback={<LoadingCallback />}>
      <GitHubCallbackContent />
    </Suspense>
  );
}
