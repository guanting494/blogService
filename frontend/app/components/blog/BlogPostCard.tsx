import Link from 'next/link';
import { BlogPost } from '@/app/lib/blogTypes';

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-xl font-semibold mb-2">
        <Link href={`/blog/${post.id}`} className="text-blue-700 hover:underline">
          {post.title}
        </Link>
      </h2>
      <p className="text-gray-600 text-sm mb-3">
        Author: {post.author} | Published: {new Date(post.published_date).toLocaleDateString()}
      </p>
      {post.tags && post.tags.length > 0 && (
        <div className="mb-3">
          {post.tags.map((tag, index) => (
            <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2 mb-1">
              #{tag}
            </span>
          ))}
        </div>
      )}
      <p className="text-gray-700 mb-4">{post.summary}</p>
      <Link href={`/blog/${post.id}`} className="text-blue-500 hover:text-blue-700 font-medium">
        Read More &rarr;
      </Link>
    </div>
  );
}