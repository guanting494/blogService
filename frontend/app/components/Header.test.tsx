import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { useAuth } from '@/app/hooks/useAuth';

// Mock useAuth hook
jest.mock('@/app/hooks/useAuth');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Header Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders login and signup buttons when not authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      username: '',
      authToken: '',
      login: jest.fn(),
      loginWithGithub: jest.fn(),
      signup: jest.fn(),
      logout: jest.fn(),
      clearMessages: jest.fn(),
      message: '',
      error: '',
    });

    render(<Header />);
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
    expect(screen.queryByText(/Welcome/)).not.toBeInTheDocument();
  });

  it('renders welcome message and logout button when authenticated', () => {
    const mockUsername = 'testuser';
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      username: mockUsername,
      authToken: 'mock-token',
      login: jest.fn(),
      loginWithGithub: jest.fn(),
      signup: jest.fn(),
      logout: jest.fn(),
      clearMessages: jest.fn(),
      message: '',
      error: '',
    });

    render(<Header />);
    
    expect(screen.getByText(`Welcome, ${mockUsername}!`)).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('calls logout function when logout button is clicked', () => {
    const mockLogout = jest.fn();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      username: 'testuser',
      authToken: 'mock-token',
      login: jest.fn(),
      loginWithGithub: jest.fn(),
      signup: jest.fn(),
      logout: mockLogout,
      clearMessages: jest.fn(),
      message: '',
      error: '',
    });

    render(<Header />);
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalled();
  });
});
