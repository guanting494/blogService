import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

interface MarkdownEditorWithPreviewProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditorWithPreview({ value, onChange }: MarkdownEditorWithPreviewProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/2">
        <label className="block text-gray-700 text-sm font-bold mb-2">Markdown Content:</label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline min-h-[200px]"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Write markdown here..."
        />
      </div>
      <div className="w-full md:w-1/2">
        <label className="block text-gray-700 text-sm font-bold mb-2">Preview:</label>
        <div className="prose bg-gray-50 border rounded p-3 min-h-[200px] overflow-x-auto">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{value || 'Nothing to preview.'}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
