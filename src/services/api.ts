
import { toast } from 'sonner';

const API_URL = 'http://localhost:5000/api'; // Change this to your actual Flask API URL

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Get the auth token from local storage
const getToken = (): string | null => {
  const user = localStorage.getItem('signscribe-user');
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.token;
    } catch (e) {
      return null;
    }
  }
  return null;
};

// Create request headers with auth token
const createHeaders = (includeContentType = true): HeadersInit => {
  const headers: HeadersInit = {};
  
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Generic fetch function with error handling
async function fetchWithAuth<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    if (!response.ok) {
      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        localStorage.removeItem('signscribe-user');
        toast.error('Session expired. Please log in again.');
        window.location.href = '/login';
        return { error: 'Session expired' };
      }
      
      // Try to get error message from response
      let errorText: string;
      try {
        const errorData = await response.json();
        errorText = errorData.message || errorData.error || `Error: ${response.status}`;
      } catch (e) {
        errorText = `Request failed with status: ${response.status}`;
      }
      
      return { error: errorText };
    }
    
    // Handle empty responses
    if (response.status === 204) {
      return { data: {} as T };
    }
    
    const data = await response.json();
    return { data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Network error';
    return { error: errorMessage };
  }
}

// API methods
export const api = {
  // Auth
  login: async (email: string, password: string) => {
    return fetchWithAuth<{ user: any, token: string }>('/auth/login', {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ email, password }),
    });
  },
  
  signup: async (name: string, email: string, password: string) => {
    return fetchWithAuth<{ user: any, token: string }>('/auth/signup', {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ name, email, password }),
    });
  },
  
  // Translation
  translateHandLandmarks: async (landmarks: any) => {
    return fetchWithAuth<{ text: string }>('/translate', {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ landmarks }),
    });
  },
  
  // User data
  getUserProfile: async () => {
    return fetchWithAuth<{ user: any }>('/user/profile', {
      method: 'GET',
      headers: createHeaders(),
    });
  },
  
  updateUserProfile: async (userData: any) => {
    return fetchWithAuth<{ user: any }>('/user/profile', {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(userData),
    });
  },
};
