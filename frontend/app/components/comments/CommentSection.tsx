import React, { useState, useEffect } from 'react';
import { Comment, fetchComments, createComment, updateComment, deleteComment } from '@/app/lib/commentApi';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import Pagination from './Pagination';
import { useAuth } from '@/app/hooks/useAuth';

interface CommentSectionProps {
  postId: number;
  postAuthor: string;
}

export default function CommentSection({ postId, postAuthor }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;
  const { authToken } = useAuth();

  // Calculate total pages
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  // Get current page's comments
  const getCurrentPageComments = () => {
    const startIndex = (currentPage - 1) * commentsPerPage;
    const endIndex = startIndex + commentsPerPage;
    return comments.slice(startIndex, endIndex);
  };

  const loadComments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchComments(postId);
      setComments(data);
    } catch (err) {
      setError('Failed to load comments');
      console.error('Error loading comments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  // Reset to first page when comments change
  useEffect(() => {
    setCurrentPage(1);
  }, [comments.length]);

  const handleCreateComment = async (content: string) => {
    try {
      const newComment = await createComment({ post_id: postId, content }, authToken || undefined);
      setComments(prev => [...prev, newComment]);
    } catch (err) { 
      throw err;
    }
  };

  const handleEditComment = async (commentId: number, content: string) => {
    try {
      const updatedComment = await updateComment(commentId, { content }, authToken || undefined);
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId ? updatedComment : comment
        )
      );
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId, authToken || undefined);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      throw err;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to comments section smoothly
    document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading comments...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
        <button 
          onClick={loadComments}
          className="ml-2 text-blue-500 hover:text-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="comments-section">
      <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
      
      <CommentForm 
        postId={postId}
        onSubmit={handleCreateComment}
      />
      
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center">No comments yet. Be the first to comment!</p>
        ) : (
          <>
            {getCurrentPageComments().map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postAuthor={postAuthor}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
              />
            ))}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}
