import Link from 'next/link';

interface BlogPost {
  id: number;
  title: string;
  author: string;
  published_date: string; 
  summary: string;
  tags: string[]; 
  content: string;
}

// 这是一个模拟的后端 API 调用函数。
// 在实际项目中，你会使用 fetch 或 axios 来调用你的 Django REST API。
async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch('http://localhost:8000/api/posts/', {
      // Next.js 的数据缓存和重新验证策略，可以根据你的需求调整
      next: { revalidate: 60 } // 每 60 秒重新验证数据
    });

    if (!res.ok) {
      // 如果响应不是 2xx 状态码，抛出错误
      const errorData = await res.json();
      throw new Error(`Failed to fetch posts: ${errorData.detail || res.statusText}`);
    }

    const data: BlogPost[] = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    // 在生产环境中，你可能希望向用户显示一个更友好的错误消息
    return []; // 返回空数组或抛出错误，取决于你的错误处理策略
  }
}

export default async function BlogListPage() {
  const posts = await fetchBlogPosts();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">博客文章列表</h1>
      <div className="flex justify-end mb-4">
        <Link href="/blog/create" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          创建新文章
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-gray-600">目前没有博客文章。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-2">
                {/* 链接到博客详情页面 */}
                <Link href={`/blog/${post.id}`} className="text-blue-700 hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 text-sm mb-3">
                作者: {post.author} | 发布日期: {new Date(post.published_date).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mb-4">{post.summary}</p>
              <Link href={`/blog/${post.id}`} className="text-blue-500 hover:text-blue-700 font-medium">
                阅读更多 &rarr;
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}