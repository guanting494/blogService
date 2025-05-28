// frontend/app/blog/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, notFound } from 'next/navigation';
import Link from 'next/link';
import BlogPostForm from '@/app/components/blog/BlogPostForm'; // Import reusable form
import { fetchBlogPost, updateBlogPost } from '@/app/lib/blogApi'; // Import API functions
import { BlogPost, BlogPostFormData } from '@/app/lib/blogTypes'; // Import types
import { useAuth } from '@/app/hooks/useAuth'; // Assuming useAuth provides current user/token

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { authToken } = useAuth(); // Get auth token

  const [initialData, setInitialData] = useState<BlogPostFormData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      const post: BlogPost | null = await fetchBlogPost(id);
      if (!post) {
        notFound(); // Display 404 if post not found
      } else {
        // Prepare initial data for the form
        setInitialData({
          title: post.title,
          content: post.content,
          author: post.author,
          summary: post.summary,
          tags: post.tags,
        });
      }
      setInitialLoading(false);
    }
    loadPost();
  }, [id]);

  const handleFormSubmit = async (data: BlogPostFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await updateBlogPost(id, data, authToken || undefined); // Pass token
      alert('Post updated successfully!');
      router.push(`/blog/${id}`); // Redirect back to post detail page
      router.refresh(); // Invalidate cache for the updated post
    } catch (err: any) {
      console.error('Error updating blog post:', err);
      setError(err.message || 'Failed to update post, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="text-center p-8">Loading post for editing...</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Blog Post</h1>
      <Link href={`/blog/${id}`} className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to Post Detail
      </Link>

      {initialData && ( // Only render form if initialData is loaded
        <BlogPostForm
          initialData={initialData}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
          error={error}
          buttonText="Update Post"
        />
      )}
    </div>
  );
}