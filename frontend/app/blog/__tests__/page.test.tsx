import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import BlogListPage from '../page';
import { fetchBlogPosts } from '@/app/lib/blogApi';
import { BlogPost } from '@/app/lib/blogTypes';

// Mock the blogApi
jest.mock('@/app/lib/blogApi');
const mockFetchBlogPosts = fetchBlogPosts as jest.MockedFunction<typeof fetchBlogPosts>;

// Mock blog posts data
const mockPosts: BlogPost[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  title: `Test Post ${i + 1}`,
  content: `Content ${i + 1}`,
  summary: `Summary ${i + 1}`,
  author: 'Test Author',
  published_date: new Date().toISOString(),
  tags: ['test'],
}));

describe('BlogListPage', () => {
  beforeEach(() => {
    mockFetchBlogPosts.mockClear();
    mockFetchBlogPosts.mockResolvedValue(mockPosts);
    window.scrollTo = jest.fn();
  });

  it('displays loading state initially', () => {
    render(<BlogListPage />);
    expect(screen.getByText('Loading blog posts...')).toBeInTheDocument();
  });

  it('shows 6 posts per page', async () => {
    await act(async () => {
      render(<BlogListPage />);
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading blog posts...')).not.toBeInTheDocument();
    });
    const posts = screen.getAllByText(/Test Post/);
    expect(posts).toHaveLength(6);
  });

  it('shows correct number of page buttons', async () => {
    await act(async () => {
      render(<BlogListPage />);
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading blog posts...')).not.toBeInTheDocument();
    });
    const pageButtons = screen.getAllByRole('button').filter(button => 
      !['previous', 'next'].includes(button.textContent?.toLowerCase() || '')
    );
    expect(pageButtons).toHaveLength(3);
  });

  it('disables previous button on first page', async () => {
    await act(async () => {
      render(<BlogListPage />);
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading blog posts...')).not.toBeInTheDocument();
    });
    const prevButton = screen.getByText('previous');
    expect(prevButton).toBeDisabled();
  });

  it('enables next button when more pages exist', async () => {
    await act(async () => {
      render(<BlogListPage />);
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading blog posts...')).not.toBeInTheDocument();
    });
    const nextButton = screen.getByText('next');
    expect(nextButton).not.toBeDisabled();
  });

  it('changes page content when clicking next/previous', async () => {
    await act(async () => {
      render(<BlogListPage />);
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading blog posts...')).not.toBeInTheDocument();
    });

    // Initial page should show posts 1-6
    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Post 6')).toBeInTheDocument();
    expect(screen.queryByText('Test Post 7')).not.toBeInTheDocument();

    // Click next page
    await act(async () => {
      fireEvent.click(screen.getByText('next'));
    });

    await waitFor(() => {
      expect(screen.getByText('Test Post 7')).toBeInTheDocument();
      expect(screen.getByText('Test Post 12')).toBeInTheDocument();
      expect(screen.queryByText('Test Post 1')).not.toBeInTheDocument();
    });

    // Click previous page
    await act(async () => {
      fireEvent.click(screen.getByText('previous'));
    });

    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
      expect(screen.getByText('Test Post 6')).toBeInTheDocument();
      expect(screen.queryByText('Test Post 7')).not.toBeInTheDocument();
    });
  });
});
