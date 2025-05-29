// frontend/app/blog/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BlogPostForm from '@/app/components/blog/BlogPostForm'; // Import reusable form
import { createBlogPost } from '@/app/lib/blogApi'; // Import API function
import { BlogPostFormData } from '@/app/lib/blogTypes'; // Import type
import { useAuth } from '@/app/hooks/useAuth'; // Assuming useAuth provides current user/token

export default function CreateBlogPostPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { authToken, username } = useAuth(); // Get auth token

  const handleFormSubmit = async (data: BlogPostFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const createdPost = await createBlogPost(data, authToken || undefined); // Pass token
      alert('Post created successfully!');
      router.push(`/blog/${createdPost.id}`); // Redirect to new post's detail page
      router.refresh(); // Invalidate cache for relevant pages
    } catch (err: any) {
      console.error('Error creating blog post:', err);
      setError(err.message || 'Failed to create post, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Create New Blog Post</h1>
      <Link href="/blog" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to Blog List
      </Link>

      <BlogPostForm
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
        error={error}
        buttonText="Create Post"
        currentUser={username || 'Anonymous'}
      />
    </div>
  );
}