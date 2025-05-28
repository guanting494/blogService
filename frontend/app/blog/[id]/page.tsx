import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { fetchBlogPost, deleteBlogPost } from '@/app/lib/blogApi'; // Import API functions
import { BlogPost } from '@/app/lib/blogTypes'; // Import BlogPost interface
import { useAuth } from '@/app/hooks/useAuth'; // Assuming useAuth provides current user/token
import { useState } from 'react';

export default async function BlogPostDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const post: BlogPost | null = await fetchBlogPost(id);

  if (!post) {
    notFound(); // Display Next.js 404 page if post is not found
  }

  // Client-side delete logic (requires 'use client' if this component were not async)
  // For simplicity, we'll put client logic in a separate component or handle in page.tsx if it's 'use client'
  // Or handle delete action via server actions if Next.js 13.4+

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
      <Link href="/blog" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to Blog List
      </Link>
      <h1 className="text-4xl font-bold mb-4 text-center">{post.title}</h1>
      <p className="text-gray-600 text-sm mb-6 text-center">
        Author: {post.author} | Published: {new Date(post.published_date).toLocaleDateString()}
      </p>
      {post.tags && post.tags.length > 0 && (
        <div className="text-center mb-6">
          {post.tags.map((tag, index) => (
            <span key={index} className="inline-block bg-blue-100 rounded-full px-3 py-1 text-sm font-semibold text-blue-800 mr-2 mb-1">
              #{tag}
            </span>
          ))}
        </div>
      )}
      <div className="prose lg:prose-lg mx-auto mb-8">
        {/* Use dangerouslySetInnerHTML if your content is HTML/Markdown, otherwise display as plain text */}
        <p>{post.content}</p>
        {/* <div dangerouslySetInnerHTML={{ __html: post.content }} /> */}
      </div>

      <div className="flex justify-end space-x-4 border-t pt-4">
        {/*
          TODO: Implement actual delete logic and button visibility based on user authentication and permissions.
          For now, this is a placeholder. A delete action would likely be a client-side function
          that calls deleteBlogPost and then redirects to the list page.
        */}
        <Link href={`/blog/${post.id}/edit`} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
          Edit
        </Link>
        <DeleteButton postId={post.id} />
      </div>
    </div>
  );
}

// Client component for delete button to handle client-side interaction
// In a real app, you might use a modal for confirmation or server actions.
function DeleteButton({ postId }: { postId: number }) {
  'use client';
  const router = useRouter();
  const { authToken } = useAuth(); // Get auth token from your useAuth hook
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteBlogPost(String(postId), authToken || undefined); // Pass token if available
      alert('Post deleted successfully!');
      router.push('/blog'); // Redirect to blog list after deletion
      router.refresh(); // Invalidate cache for blog list
    } catch (error: any) {
      console.error('Error deleting post:', error);
      alert(`Failed to delete post: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
      disabled={isDeleting}
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}