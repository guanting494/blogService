'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { fetchBlogPost } from '@/app/lib/blogApi';
import { BlogPost } from '@/app/lib/blogTypes';
import BlogPostActions from '@/app/components/blog/BlogPostActions';

export default function BlogPostDetailPage() {
  const params = useParams();
  const id = params.id as string;
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
        <p>{post.content}</p>
      </div>

      <BlogPostActions postId={post.id} authorName={post.author} />
    </div>
  );
}