import React, { useState } from 'react';
import { Comment } from '@/app/lib/commentApi';
import { useAuth } from '@/app/hooks/useAuth';

interface CommentItemProps {
  comment: Comment;
  postAuthor: string;
  onEdit: (id: number, content: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function CommentItem({ 
  comment, 
  postAuthor,
  onEdit, 
  onDelete 
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { username } = useAuth();
  const canModify = username === comment.author_username || username === postAuthor;

  const handleEdit = async () => {
    if (!editContent.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await onEdit(comment.id, editContent);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update comment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await onDelete(comment.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="font-semibold">{comment.author_username}</span>
          <span className="text-gray-500 text-sm ml-2">
            {new Date(comment.created_date).toLocaleDateString()}
          </span>
          {comment.updated_date !== comment.created_date && (
            <span className="text-gray-500 text-sm ml-2">(edited)</span>
          )}
        </div>
        {canModify && !isEditing && (
          <div className="space-x-2">
            <button 
              onClick={() => setIsEditing(true)}
              className="text-blue-500 hover:text-blue-600"
              disabled={isLoading}
            >
              Edit
            </button>
            <button 
              onClick={handleDelete}
              className="text-red-500 hover:text-red-600"
              disabled={isLoading}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={3}
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="space-x-2">
            <button
              onClick={handleEdit}
              disabled={isLoading}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditContent(comment.content);
                setError(null);
              }}
              disabled={isLoading}
              className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="text-gray-700 whitespace-pre-wrap">{comment.content}</div>
      )}
    </div>
  );
}
