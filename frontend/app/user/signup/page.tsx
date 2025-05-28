'use client';

import SignupForm from '@/app/components/auth/SignupForm';


export default function SignupPage() {
  return (
    <div className="container">
      <main className="main">
        <div className="formContainer">
        <SignupForm />
        </div>
      </main>
    </div>
  );
}