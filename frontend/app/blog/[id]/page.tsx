import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchBlogPost } from '@/app/lib/blogApi';
import { BlogPost } from '@/app/lib/blogTypes';
import BlogPostActions from '@/app/components/blog/BlogPostActions';


interface PageProps {
  params: {
    id: string;
  };
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const post: BlogPost | null = await fetchBlogPost(params.id);

  if (!post) {
    notFound();
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
            <span key={index} className="inline-block bg-blue-100 rounded-full px-3 py-1 text-sm font-semibold text-blue-800 mr-2 mb-1">
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