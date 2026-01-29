
// Define types for auth responses
interface AuthResponse {
  error?: {
    message: string;
  };
}

interface SignUpParams {
  email: string;
  password: string;
  name: string;
  fetchOptions?: RequestInit;
}

interface SignInParams {
  email: string;
  password: string;
  fetchOptions?: RequestInit;
}

// Create a static auth client with guaranteed methods to prevent "undefined" errors
// This ensures that authClient.signUp.email and authClient.signIn.email always exist
const authClient = {
  signUp: {
    email: async (params: SignUpParams): Promise<AuthResponse> => {
      try {
        // Call the backend auth endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: params.name,
            email: params.email,
            password: params.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          return { error: { message: data.detail || 'Signup failed' } };
        }

        // Return success (no error)
        return {};
      } catch (error: any) {
        return { error: { message: error.message || 'Signup failed' } };
      }
    }
  },
  signIn: {
    email: async (params: SignInParams): Promise<AuthResponse> => {
      try {
        // Call the backend auth endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/auth/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: params.email,
            password: params.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          return { error: { message: data.detail || 'Signin failed' } };
        }

        // Store the token in localStorage for the session
        if (data.access_token) {
          localStorage.setItem('auth_token', data.access_token);
        }

        // Return success (no error)
        return {};
      } catch (error: any) {
        return { error: { message: error.message || 'Signin failed' } };
      }
    }
  },
  useSession: () => {
    const token = localStorage.getItem('auth_token');
    return {
      data: token ? { token } : null,
      isLoading: false
    };
  },
};

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Create an API service with JWT token handling
class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Get JWT token from auth client
  private async getAuthToken(): Promise<string | null> {
    try {
      // For our custom auth, get the token from localStorage
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        return token;
      }
      return null;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  // Generic request method with JWT token
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Get the auth token
    const token = await this.getAuthToken();

    // Set up headers with token
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    } as Record<string, string>;

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_email');
        window.location.href = '/signin';
      }
      throw new Error('Unauthorized - please login again');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Export the API service instance
export const api = new ApiService();

// Export the auth client
export { authClient };