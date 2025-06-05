import React, { useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';

interface CommentFormProps {
  postId: number;
  onSubmit: (content: string) => Promise<void>;
  initialContent?: string;
  buttonText?: string;
}

export default function CommentForm({ 
  postId, 
  onSubmit, 
  initialContent = '', 
  buttonText = 'Post Comment' 
}: CommentFormProps) {
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please log in to post a comment');
      return;
    }

    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    if (content.length > 200) {
      setError('Comment cannot exceed 200 characters');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(content);
      setContent('');  // Clear form after successful submission
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        Please log in to post comments
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => {
            if (e.target.value.length <= 200) {
              setContent(e.target.value);
              setError(null);
            } else {
              setError('Comment cannot exceed 200 characters');
            }
          }}
          placeholder="Write your comment here..."
          rows={3}
          maxLength={200}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        <div className="absolute bottom-2 right-2 text-sm text-gray-500">
          {content.length}/200
        </div>
      </div>
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : buttonText}
        </button>
      </div>
    </form>
  );
}
