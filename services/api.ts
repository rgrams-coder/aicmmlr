import { API_CONFIG } from '../config';

const API_BASE_URL = API_CONFIG.API_BASE_URL;

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async register(data: any) {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async login(email: string, password: string) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async adminLogin(email: string, password: string) {
    return this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async getProfile() {
    return this.request('/profile');
  }

  async updateProfile(data: any) {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Admin
  async getUsers(page = 1, limit = 10) {
    return this.request(`/admin/users?page=${page}&limit=${limit}`);
  }

  // Payments
  async createOrder(amount: number) {
    return this.request('/createOrder', {
      method: 'POST',
      body: JSON.stringify({ amount })
    });
  }

  async verifyPayment(paymentData: any) {
    return this.request('/payment/verify', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  }

  // Cases
  async createCase(caseData: any) {
    return this.request('/cases', {
      method: 'POST',
      body: JSON.stringify(caseData)
    });
  }

  async getCases(page = 1, limit = 10) {
    return this.request(`/cases?page=${page}&limit=${limit}`);
  }

  async getCase(id: string) {
    return this.request(`/cases/${id}`);
  }

  async updateCase(id: string, data: any) {
    return this.request(`/cases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Documents
  async getDocuments(page = 1, limit = 10) {
    return this.request(`/documents?page=${page}&limit=${limit}`);
  }

  async getDocument(id: string) {
    return this.request(`/documents/${id}`);
  }

  async createDocument(data: any, file?: File) {
    if (file) {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
      formData.append('file', file);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/documents`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: formData
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Request failed');
      }
      
      return response.json();
    }
    
    return this.request('/documents', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateDocument(id: string, data: any) {
    return this.request(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteDocument(id: string) {
    return this.request(`/documents/${id}`, {
      method: 'DELETE'
    });
  }

  // Feedback
  async submitFeedback(data: any) {
    return this.request('/feedback', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getFeedbacks(page = 1, limit = 10) {
    return this.request(`/admin/feedbacks?page=${page}&limit=${limit}`);
  }

  // Contact
  async submitContact(data: any) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getContactMessages(page = 1, limit = 10) {
    return this.request(`/admin/contact-messages?page=${page}&limit=${limit}`);
  }
}

export const apiService = new ApiService();