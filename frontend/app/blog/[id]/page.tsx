'use client';

import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { fetchBlogPost } from '@/app/lib/blogApi';
import { BlogPost } from '@/app/lib/blogTypes';
import BlogPostActions from '@/app/components/blog/BlogPostActions';
import CommentSection from '@/app/components/comments/CommentSection';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import DOMPurify from 'dompurify';
import '@/app/markdown.css';

export default function BlogPostDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        const fetchedPost = await fetchBlogPost(id);
        if (!fetchedPost) {
          notFound(); // Redirect to 404 if post not found
        } else {
          setPost(fetchedPost);
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        notFound(); // Redirect to 404 on error
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [id]);

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (!post) {
    return <div className="text-center p-8">Post not found</div>;
  }

  return (
    <div className="container-fluid px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
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
              <span
                key={index}
                className="inline-block bg-blue-100 rounded-full px-3 py-1 text-sm font-semibold text-blue-800 mr-2 mb-1"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        <div className="prose lg:prose-lg mx-auto mb-8">
          <MarkdownSafeHtml content={post.content} />
        </div>
      </div>
      <BlogPostActions postId={post.id} authorName={post.author} />
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="w-full">
          <CommentSection postId={post.id} postAuthor={post.author} />
        </div>
      </div>
    </div>
  );
}

// MarkdownSafeHtml 组件
function MarkdownSafeHtml({ content }: { content: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (ref.current) {
      const rawHtml = (
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{content}</ReactMarkdown>
      );
      const temp = document.createElement('div');
      // @ts-ignore
      import('react-dom/server').then((server) => {
        temp.innerHTML = server.renderToStaticMarkup(rawHtml);
        ref.current!.innerHTML = DOMPurify.sanitize(temp.innerHTML);
      });
    }
  }, [content]);
  return <div ref={ref}></div>;
}