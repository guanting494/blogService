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
    
    if (editContent.length > 200) {
      setError('Comment cannot exceed 200 characters');
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
        </div>
        {canModify && !isEditing && (
          <div className="space-x-2">
            <button 
              onClick={() => setIsEditing(true)}
              className="group relative px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <span className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded px-2 py-1 left-full ml-2 top-1/2 transform -translate-y-1/2">
                Edit
              </span>
            </button>
            <button 
              onClick={handleDelete}
              className="group relative px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded px-2 py-1 left-full ml-2 top-1/2 transform -translate-y-1/2">
                Delete
              </span>
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <div className="relative">
            <textarea
              value={editContent}
              onChange={(e) => {
                if (e.target.value.length <= 200) {
                  setEditContent(e.target.value);
                  setError(null);
                } else {
                  setError('Comment cannot exceed 200 characters');
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              maxLength={200}
            />
            <div className="absolute bottom-2 right-2 text-sm text-gray-500">
              {editContent.length}/200
            </div>
          </div>
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
