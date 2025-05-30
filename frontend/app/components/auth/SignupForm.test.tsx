import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupForm from './SignupForm';
import { useAuth } from '@/app/hooks/useAuth';

// Mock useAuth hook
jest.mock('@/app/hooks/useAuth');

describe('SignupForm Component', () => {
  // Mock implementation of useAuth
  const mockSignup = jest.fn();
  const mockClearMessages = jest.fn();
  
  beforeEach(() => {
    // Reset mock functions before each test
    jest.clearAllMocks();
    
    // Default mock implementation
    (useAuth as jest.Mock).mockReturnValue({
      signup: mockSignup,
      clearMessages: mockClearMessages,
      message: '',
      error: '',
    });
  });

  it('renders signup form with all fields', () => {
    render(<SignupForm />);
    
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Signup/i })).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    const testData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    };
    
    render(<SignupForm />);
    
    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: testData.username },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: testData.email },
    });
    fireEvent.change(screen.getByLabelText('Password:'), {
      target: { value: testData.password },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: testData.passwordConfirm },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Signup/i }));

    // Verify functions were called
    expect(mockClearMessages).toHaveBeenCalled();
    expect(mockSignup).toHaveBeenCalledWith(
      testData.username,
      testData.email,
      testData.password,
      testData.passwordConfirm
    );
  });

  it('displays success message', () => {
    const successMessage = 'Account created successfully!';
    (useAuth as jest.Mock).mockReturnValue({
      signup: mockSignup,
      clearMessages: mockClearMessages,
      message: successMessage,
      error: '',
    });

    render(<SignupForm />);
    expect(screen.getByText(successMessage)).toBeInTheDocument();
  });

  it('displays error message', () => {
    const errorMessage = 'Username already exists';
    (useAuth as jest.Mock).mockReturnValue({
      signup: mockSignup,
      clearMessages: mockClearMessages,
      message: '',
      error: errorMessage,
    });

    render(<SignupForm />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('requires all fields', () => {
    render(<SignupForm />);
    
    // Check that all fields are required
    expect(screen.getByLabelText(/Username/i)).toBeRequired();
    expect(screen.getByLabelText(/Email/i)).toBeRequired();
    expect(screen.getByLabelText('Password:')).toBeRequired();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeRequired();
  });

  it('validates email format', () => {
    render(<SignupForm />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    expect(emailInput).toHaveAttribute('type', 'email');
  });
});
