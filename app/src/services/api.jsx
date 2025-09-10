// API service for handling authentication and requests
const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  // Helper method to make requests with credentials
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Always include cookies
      ...options,
    };

    try {
      const response = await fetch(url, config);
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(username, password) {
    const response = await this.request('/accounts/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  }

  async logout() {
    const response = await this.request('/accounts/logout/', {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    return response.json();
  }

  async register(userData) {
    const response = await this.request('/accounts/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return response.json();
  }

  async getProfile() {
    const response = await this.request('/accounts/profile/');
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  }

  async updateProfile(profileData) {
    const response = await this.request('/accounts/profile/', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return response.json();
  }

  // Course methods
  async getCourses() {
    const response = await this.request('/courses/courses/');
    return response.json();
  }

  async getCourse(courseId) {
    const response = await this.request(`/courses/courses/${courseId}/`);
    return response.json();
  }

  // Assignment methods
  async getAssignments() {
    const response = await this.request('/projects/assignments/');
    return response.json();
  }

  async getAssignment(assignmentId) {
    const response = await this.request(`/projects/assignments/${assignmentId}/`);
    return response.json();
  }

  async submitAssignment(assignmentId, answers) {
    const response = await this.request(`/projects/assignments/${assignmentId}/submit/`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit assignment');
    }

    return response.json();
  }

  // Enrollment methods
  async enrollInCourse(courseId, studentId) {
    const response = await this.request('/courses/enrollments/', {
      method: 'POST',
      body: JSON.stringify({ course: courseId, student: studentId }),
    });

    if (!response.ok) {
      throw new Error('Enrollment failed');
    }

    return response.json();
  }
}

export const apiService = new ApiService();
export default apiService;