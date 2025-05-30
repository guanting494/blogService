const API_BASE_URL = 'http://localhost:8000'; // backend API
const USER_URL = `${API_BASE_URL}/users`;

interface UserData {
  username: string;
  email: string;
  name?: string;
}

interface LoginResponse {
  key?: string; // DRF Token Authentication
  user?: UserData;
}

interface SignupResponse extends LoginResponse {
}

interface LogoutResponse {
  detail: string; // "Successfully logged out."
}

interface ErrorResponse {
  detail?: string;  // optional error message
  non_field_errors?: string[];
  [key: string]: any; // other error message like username: ["This field is required."]
}

// helper function: to handle API responses
async function handleApiResponse<T>(response: Response): Promise<T> {
  const data: T | ErrorResponse = await response.json();

  if (!response.ok) {
    // throw an error if the response is not ok
    const errorData = data as ErrorResponse;
    const errorMessage = errorData.detail || errorData.non_field_errors?.[0] || JSON.stringify(errorData);
    throw new Error(errorMessage);
  }
  return data as T;
}

// login API
export const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${USER_URL}/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  return handleApiResponse<LoginResponse>(response);
};

// signUp API
export const signupUser = async (username: string, email: string, password1: string, password2: string): Promise<SignupResponse> => {
  const response = await fetch(`${USER_URL}/signup/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      email,
      password1,
      password2: password2,
    }),
  });
  return handleApiResponse<SignupResponse>(response);
};

// logout API
export const logoutUser = async (token: string): Promise<LogoutResponse> => {
  const response = await fetch(`${USER_URL}/logout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`, // assuming token-based authentication
    },
  });
  return handleApiResponse<LogoutResponse>(response);
};

// GitHub OAuth login
export const githubSocialLogin = async (code: string): Promise<LoginResponse> => {
  const response = await fetch(`${USER_URL}/github/callback/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });
  return handleApiResponse<LoginResponse>(response);
};