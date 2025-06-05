const API_BASE_URL = 'http://localhost:8000'; 
const COMMENT_URL = `${API_BASE_URL}/comments`;

export interface Comment {
  id: number;
  post_id: number;
  author_id: number;
  author_username: string;
  content: string;
  created_date: string;
  updated_date: string;
}

export interface CreateCommentData {
  post_id: number;
  content: string;
}

export interface UpdateCommentData {
  content: string;
}

// Fetch comments for a specific post
export const fetchComments = async (postId: number): Promise<Comment[]> => {
  const response = await fetch(`${COMMENT_URL}/?post_id=${postId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }
  return response.json();
};

// Create a new comment
export const createComment = async (data: CreateCommentData, authToken?: string): Promise<Comment> => {
  if (!authToken) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${COMMENT_URL}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create comment');
  }
  return response.json();
};

// Update a comment
export const updateComment = async (id: number, data: UpdateCommentData, authToken?: string): Promise<Comment> => {
  if (!authToken) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${COMMENT_URL}/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update comment');
  }
  return response.json();
};

// Delete a comment
export const deleteComment = async (id: number, authToken?: string): Promise<void> => {
  if (!authToken) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${COMMENT_URL}/${id}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete comment');
  }
};
