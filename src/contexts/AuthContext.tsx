import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Address, Order } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Order;
  getOrders: () => Order[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'cozy-stitches-user';
const USERS_STORAGE_KEY = 'cozy-stitches-users';
const ORDERS_STORAGE_KEY = 'cozy-stitches-orders';

const generateId = () => Math.random().toString(36).substring(2, 15);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse user from localStorage');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      // Also update in users list
      const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
      const updatedUsers = users.map((u: User & { password: string }) => 
        u.id === user.id ? { ...u, ...user } : u
      );
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    const foundUser = users.find((u: User & { password: string }) => 
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return { success: true };
    }
    
    return { success: false, error: 'Invalid email or password' };
  };

  const signup = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string
  ): Promise<{ success: boolean; error?: string }> => {
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    
    if (users.some((u: User) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists' };
    }
    
    const newUser: User & { password: string } = {
      id: generateId(),
      email,
      password,
      firstName,
      lastName,
      addresses: [],
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    if (user) {
      const newAddress: Address = {
        ...address,
        id: generateId(),
      };
      
      // If this is the first address or marked as default, make it default
      const addresses = address.isDefault || user.addresses.length === 0
        ? user.addresses.map(a => ({ ...a, isDefault: false })).concat({ ...newAddress, isDefault: true })
        : [...user.addresses, newAddress];
      
      setUser({ ...user, addresses });
    }
  };

  const updateAddress = (id: string, updates: Partial<Address>) => {
    if (user) {
      let addresses = user.addresses.map(a => 
        a.id === id ? { ...a, ...updates } : a
      );
      
      // If setting as default, unset others
      if (updates.isDefault) {
        addresses = addresses.map(a => ({
          ...a,
          isDefault: a.id === id,
        }));
      }
      
      setUser({ ...user, addresses });
    }
  };

  const deleteAddress = (id: string) => {
    if (user) {
      const addresses = user.addresses.filter(a => a.id !== id);
      // If we deleted the default, make the first one default
      if (addresses.length > 0 && !addresses.some(a => a.isDefault)) {
        addresses[0].isDefault = true;
      }
      setUser({ ...user, addresses });
    }
  };

  const setDefaultAddress = (id: string) => {
    if (user) {
      const addresses = user.addresses.map(a => ({
        ...a,
        isDefault: a.id === id,
      }));
      setUser({ ...user, addresses });
    }
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt'>): Order => {
    const order: Order = {
      ...orderData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    
    const orders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
    orders.push(order);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    
    return order;
  };

  const getOrders = (): Order[] => {
    if (!user) return [];
    const orders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
    return orders.filter((o: Order) => o.userId === user.id).sort(
      (a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
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
