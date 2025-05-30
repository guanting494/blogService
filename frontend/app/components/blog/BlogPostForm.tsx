'use client';

import React, { useState, useEffect } from 'react';
import { BlogPostFormData } from '@/app/lib/blogTypes';

interface BlogPostFormProps {
  initialData?: BlogPostFormData; // Optional initial data for editing
  onSubmit: (data: BlogPostFormData) => void;
  isLoading: boolean;
  error: string | null;
  buttonText: string;
  currentUser: string;
}

export default function BlogPostForm({ initialData, onSubmit, isLoading, error, buttonText, currentUser}: BlogPostFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [author, setAuthor] = useState(initialData?.author || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [tags, setTags] = useState(initialData?.tags ? initialData.tags.join(', ') : '');

  // Update form fields if initialData changes (e.g., when loading data for edit)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setAuthor(initialData.author);
      setSummary(initialData.summary);
      setTags(initialData.tags.join(', '));
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    onSubmit({
      title,
      content,
      author: currentUser,
      summary,
      tags: formattedTags
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
          Title:
        </label>
        <input
          type="text"
          id="title"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Author
        </label>
        <input
          type="text"
          value={currentUser}
          disabled
          className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600"
          readOnly
        />
      </div>
      <div>
        <label htmlFor="summary" className="block text-gray-700 text-sm font-bold mb-2">
          Summary:
        </label>
        <textarea
          id="summary"
          rows={3}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
        ></textarea>
      </div>
      <div>
        <label htmlFor="tags" className="block text-gray-700 text-sm font-bold mb-2">
          Tags (comma-separated):
        </label>
        <input
          type="text"
          id="tags"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. programming, react, django"
        />
      </div>
      <div>
        <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
          Content:
        </label>
        <textarea
          id="content"
          rows={10}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : buttonText}
        </button>
      </div>
    </form>
  );
}