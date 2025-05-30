import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from './LoginForm';
import { useAuth } from '@/app/hooks/useAuth';

// Mock useAuth hook
jest.mock('@/app/hooks/useAuth');

describe('LoginForm Component', () => {
  // Mock implementation of useAuth
  const mockLogin = jest.fn();
  const mockClearMessages = jest.fn();
  
  beforeEach(() => {
    // Reset mock functions before each test
    jest.clearAllMocks();
    
    // Default mock implementation
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      clearMessages: mockClearMessages,
      message: '',
      error: '',
    });
  });

  it('renders login form with all fields', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const testUsername = 'testuser';
    const testPassword = 'testpass';
    
    render(<LoginForm />);
    
    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: testUsername },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: testPassword },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // Verify functions were called
    expect(mockClearMessages).toHaveBeenCalled();
    expect(mockLogin).toHaveBeenCalledWith(testUsername, testPassword);
  });

  it('displays success message', () => {
    const successMessage = 'Login successful!';
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      clearMessages: mockClearMessages,
      message: successMessage,
      error: '',
    });

    render(<LoginForm />);
    expect(screen.getByText(successMessage)).toBeInTheDocument();
  });

  it('displays error message', () => {
    const errorMessage = 'Invalid credentials';
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      clearMessages: mockClearMessages,
      message: '',
      error: errorMessage,
    });

    render(<LoginForm />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('requires username and password fields', () => {
    render(<LoginForm />);
    
    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    expect(usernameInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });
});
