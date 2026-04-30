import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, addressesAPI, ordersAPI } from '@/lib/api';

const AuthContext = createContext(undefined);

const USER_STORAGE_KEY = 'cozy-stitches-user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      // Check if we have a token first
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await authAPI.getCurrentUser();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
        }
      } catch (error) {
        // Token invalid or expired, clear storage
        if (error.message === 'UNAUTHORIZED' || error.message.includes('401')) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem(USER_STORAGE_KEY);
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);
      if (data.user && data.token) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { success: false, error: error.message || 'Invalid email or password' };
    }
  };

  const signup = async (email, password, firstName, lastName) => {
    try {
      const data = await authAPI.register(email, password, firstName, lastName);
      if (data.user && data.token) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: 'Signup failed' };
    } catch (error) {
      return { success: false, error: error.message || 'An account with this email already exists' };
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const updateProfile = async (updates) => {
    try {
      const data = await authAPI.updateProfile(updates);
      if (data.user) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: 'Update failed' };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to update profile' };
    }
  };

  const addAddress = async (address) => {
    try {
      const data = await addressesAPI.create(address);
      if (data.address) {
        // Refresh user to get updated addresses
        const userData = await authAPI.getCurrentUser();
        if (userData.user) {
          setUser(userData.user);
        }
        return { success: true, address: data.address };
      }
      return { success: false, error: 'Failed to add address' };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to add address' };
    }
  };

  const updateAddress = async (id, updates) => {
    try {
      const data = await addressesAPI.update(id, updates);
      if (data.address) {
        // Refresh user to get updated addresses
        const userData = await authAPI.getCurrentUser();
        if (userData.user) {
          setUser(userData.user);
        }
        return { success: true, address: data.address };
      }
      return { success: false, error: 'Failed to update address' };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to update address' };
    }
  };

  const deleteAddress = async (id) => {
    try {
      await addressesAPI.delete(id);
      // Refresh user to get updated addresses
      const userData = await authAPI.getCurrentUser();
      if (userData.user) {
        setUser(userData.user);
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to delete address' };
    }
  };

  const setDefaultAddress = async (id) => {
    try {
      const data = await addressesAPI.setDefault(id);
      if (data.address) {
        // Refresh user to get updated addresses
        const userData = await authAPI.getCurrentUser();
        if (userData.user) {
          setUser(userData.user);
        }
        return { success: true };
      }
      return { success: false, error: 'Failed to set default address' };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to set default address' };
    }
  };

  const addOrder = async (orderData) => {
    try {
      const data = await ordersAPI.create(orderData);
      if (data.order) {
        return { success: true, order: data.order };
      }
      return { success: false, error: 'Failed to create order' };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to create order' };
    }
  };

  const getOrders = async () => {
    try {
      const data = await ordersAPI.getAll();
      if (data.orders) {
        return data.orders;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      return [];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        addOrder,
        getOrders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
