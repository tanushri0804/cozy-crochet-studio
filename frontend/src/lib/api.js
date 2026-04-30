const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getToken = () => {
  return localStorage.getItem('auth_token');
};

// Helper function to set auth token
const setToken = (token) => {
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle empty responses
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (parseError) {
        data = {};
      }
    } else {
      data = {};
    }

    if (!response.ok) {
      // Don't throw for 401 on /auth/me - it's expected when not logged in
      if (response.status === 401 && endpoint === '/auth/me') {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    // Handle network errors (server not running)
    if (error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to server. Please make sure the backend is running.');
    }
    
    // Only log non-expected errors
    if (error.message !== 'UNAUTHORIZED') {
      console.error('API request error:', error);
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (email, password, firstName, lastName) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },

  login: async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },

  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },

  updateProfile: async (updates) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  logout: () => {
    setToken(null);
    localStorage.removeItem('user');
  },
};

// Products API
export const productsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/products${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return apiRequest(`/products/${id}`);
  },

  create: async (productData) => {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  update: async (id, productData) => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Orders API
export const ordersAPI = {
  getAll: async () => {
    return apiRequest('/orders');
  },

  getById: async (id) => {
    return apiRequest(`/orders/${id}`);
  },

  create: async (orderData) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },
};

// Addresses API
export const addressesAPI = {
  getAll: async () => {
    return apiRequest('/addresses');
  },

  getById: async (id) => {
    return apiRequest(`/addresses/${id}`);
  },

  create: async (address) => {
    return apiRequest('/addresses', {
      method: 'POST',
      body: JSON.stringify(address),
    });
  },

  update: async (id, updates) => {
    return apiRequest(`/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  delete: async (id) => {
    return apiRequest(`/addresses/${id}`, {
      method: 'DELETE',
    });
  },

  setDefault: async (id) => {
    return apiRequest(`/addresses/${id}/default`, {
      method: 'PATCH',
    });
  },
};

// Coupons API
export const couponsAPI = {
  validate: async (code, orderTotal) => {
    return apiRequest('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, orderTotal }),
    });
  },
};

// Upload API
export const uploadAPI = {
  uploadImage: async (file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || 'Failed to upload image');
    }
    
    return response.json();
  },
  
  uploadMultipleImages: async (files) => {
    const token = getToken();
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    
    const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || 'Failed to upload images');
    }
    
    return response.json();
  },
};

// Admin API
export const adminAPI = {
  getAllOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/orders${queryString ? `?${queryString}` : ''}`);
  },

  getStats: async () => {
    return apiRequest('/admin/stats');
  },

  getAllUsers: async () => {
    return apiRequest('/admin/users');
  },
};

export { getToken, setToken };

