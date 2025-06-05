/**
 * Defines the structure for a blog post.
 */
export interface BlogPost {
  id: number;
  title: string;
  author: string;
  published_date: string;
  summary: string;
  tags: string[];
  content: string;
  content_html?: string; // Added for type-safe access to the backend's HTML field
}

/**
 * Defines the data structure for creating or updating a blog post.
 * Excludes `id` and `published_date` as they are usually handled by the backend
 * or set automatically during creation.
 */
export interface BlogPostFormData {
  title: string;
  author: string;
  summary: string;
  tags: string[];
  content: string;
}

/**
 * Defines common API error response structure.
 */
export interface ApiError {
  detail?: string;
  [key: string]: any; // Allows for other error fields
}