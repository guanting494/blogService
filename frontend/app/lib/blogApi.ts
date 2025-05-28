import { BlogPost, BlogPostFormData, ApiError } from './blogTypes';

const API_BASE_URL = 'http://localhost:8000'; 
const BLOG_URL = `${API_BASE_URL}/blog`;

/**
 * Fetches all blog posts from the API.
 * @returns A promise that resolves to an array of BlogPost objects.
 */
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${BLOG_URL}/posts/`, {
      next: { revalidate: 60 } // Revalidate data every 60 seconds
    });

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      throw new Error(`Failed to fetch posts: ${errorData.detail || res.statusText}`);
    }

    const data: BlogPost[] = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

/**
 * Fetches a single blog post by its ID.
 * @param id The ID of the blog post.
 * @returns A promise that resolves to a BlogPost object or null if not found.
 */
export async function fetchBlogPost(id: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${BLOG_URL}/posts/${id}/`, {
      next: { revalidate: 60 }
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      const errorData: ApiError = await res.json();
      throw new Error(`Failed to fetch post ${id}: ${errorData.detail || res.statusText}`);
    }

    const data: BlogPost = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching blog post ${id}:`, error);
    return null;
  }
}

/**
 * Creates a new blog post.
 * @param postData The data for the new blog post.
 * @param authToken Optional: Authentication authToken for protected routes.
 * @returns A promise that resolves to the created BlogPost object.
 */
export async function createBlogPost(postData: BlogPostFormData, authToken?: string): Promise<BlogPost> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (authToken) {
    headers['Authorization'] = `Token ${authToken}`;
  }

  const res = await fetch(`${BLOG_URL}/posts/`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(postData),
  });

  if (!res.ok) {
    const errorData: ApiError = await res.json();
    throw new Error(`Failed to create post: ${errorData.detail || res.statusText || 'Unknown error'}`);
  }

  return res.json();
}

/**
 * Updates an existing blog post.
 * @param id The ID of the blog post to update.
 * @param postData The updated data for the blog post.
 * @param authToken Optional: Authentication authToken for protected routes.
 * @returns A promise that resolves to the updated BlogPost object.
 */
export async function updateBlogPost(id: string, postData: BlogPostFormData, authToken?: string): Promise<BlogPost> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (authToken) {
    headers['Authorization'] = `Token ${authToken}`;
  }

  const res = await fetch(`${BLOG_URL}/posts/${id}/`, {
    method: 'PUT', // Use PUT for full update, PATCH for partial
    headers: headers,
    body: JSON.stringify(postData),
  });

  if (!res.ok) {
    const errorData: ApiError = await res.json();
    throw new Error(`Failed to update post: ${errorData.detail || res.statusText || 'Unknown error'}`);
  }

  return res.json();
}

/**
 * Deletes a blog post by its ID.
 * @param id The ID of the blog post to delete.
 * @param authToken Optional: Authentication authToken for protected routes.
 * @returns A promise that resolves when the post is successfully deleted.
 */
export async function deleteBlogPost(id: string, authToken?: string): Promise<void> {
  const headers: HeadersInit = {};
  if (authToken) {
    headers['Authorization'] = `Token ${authToken}`;
  }

  const res = await fetch(`${BLOG_URL}/posts/${id}/`, {
    method: 'DELETE',
    headers: headers,
  });

  if (!res.ok) {
    const errorData: ApiError = await res.json();
    throw new Error(`Failed to delete post: ${errorData.detail || res.statusText || 'Unknown error'}`);
  }
}