import Link from 'next/link';
import { fetchBlogPosts } from '@/app/lib/blogApi'; // Import API function
import { BlogPost } from '@/app/lib/blogTypes'; // Import BlogPost interface
import BlogPostCard from '@/app/components/blog/BlogPostCard'; // Import BlogPostCard component

export default async function BlogListPage() {
  const posts: BlogPost[] = await fetchBlogPosts();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Blog Post List</h1>
      <div className="flex justify-end mb-4">
        <Link href="/blog/create" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Create New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-gray-600">No blog posts available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}