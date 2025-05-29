'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';
import { deleteBlogPost } from '@/app/lib/blogApi';

export default function BlogPostActions({ postId, authorName }: { postId: number, authorName: string }) {
  const router = useRouter();
  const { authToken, username } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const isAuthor = username === authorName;

  if (!isAuthor) {
    return null;
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteBlogPost(String(postId), authToken || undefined);
      alert('Post deleted successfully!');
      router.push('/blog');
      router.refresh();
    } catch (error: any) {
      console.error('Error deleting post:', error);
      alert(`Failed to delete post: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex justify-end space-x-4 border-t pt-4">
      <Link 
        href={`/blog/${postId}/edit`} 
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
      >
        Edit
      </Link>
      <button
        onClick={handleDelete}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        disabled={isDeleting}
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}