import { api } from '@/lib/api';

// Define user type
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

// Helper function to extract user information from JWT token
export function getUserInfoFromToken(): UserProfile | null {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        // Decode JWT token to extract user information
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
        );

        const decoded = JSON.parse(jsonPayload);

        // Since we only have the user ID in the JWT token, we'll return a partial profile
        // In a real app, you'd probably want to call an API endpoint to get full user details
        return {
          id: decoded.sub,
          name: localStorage.getItem('user_name') || 'User', // Fallback to stored name or generic
          email: localStorage.getItem('user_email') || 'user@example.com' // Fallback to stored email
        };
      } catch (error) {
        console.error('Error decoding JWT token:', error);
        return null;
      }
    }
  }
  return null;
}

// Function to store user information after successful login
export function storeUserInfo(profile: UserProfile) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_name', profile.name);
    localStorage.setItem('user_email', profile.email);
  }
}

// Function to clear user information on logout
export function clearUserInfo() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
  }
}

class UserService {
  // Get user profile by making an authenticated request to the backend
  async getCurrentUser(): Promise<UserProfile | null> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return null;
    }

    try {
      // Try to get user ID from the token to construct the API call
      const tokenInfo = getUserInfoFromToken();
      if (!tokenInfo) {
        return null;
      }

      // Try to fetch user tasks to verify user exists and get user context
      // This will authenticate the user and return user-related data
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/${tokenInfo.id}/tasks`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // The user exists and is authenticated, so return the token info
        // In a real backend, there would be a dedicated profile endpoint
        // For now, we'll return the info we have, but we know the user is valid
        return {
          id: tokenInfo.id,
          name: tokenInfo.name,
          email: tokenInfo.email
        };
      } else {
        // If the request fails, fall back to token info
        return tokenInfo;
      }
    } catch (error) {
      console.error('Error getting user profile from backend:', error);
      // Fallback to the original method
      return getUserInfoFromToken();
    }
  }

  // Method to update user profile information
  async updateUserProfile(name: string, email: string): Promise<void> {
    try {
      // In a real application, this would make an API call to update the user profile
      // Since there's no dedicated endpoint, we'll update localStorage for now
      // But the proper implementation would call a backend endpoint like:
      // await api.put(`/api/users/${userId}`, { name, email });

      localStorage.setItem('user_name', name);
      localStorage.setItem('user_email', email);

      console.log('User profile updated locally:', { name, email });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
}

export const userService = new UserService();