import  { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Define the types for the context and props
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  cart: Product[];
  login: (userData: User) => void;
  logout: () => void;
  updateUserProfile: (profileData: Partial<User>) => void;
  updateCart: (newCart: Product[]) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  token: string;

}

interface Product {
  id: string;
  name: string;
  // Add other product properties here
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<Product[]>([]);

  const login = (userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    fetchCart(userData.token); // Fetch cart data after login
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCart([]);
    localStorage.removeItem('user');
  };

  const updateUserProfile = (profileData: Partial<User>) => {
    setUser((prevUser) => ({ ...prevUser!, ...profileData }));
  };

  const fetchCart = async (token: string) => {
    try {
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCart(response.data.products || []); // Ensure cart is an array
    } catch (error) {
      console.error('Failed to fetch cart', error);
    }
  };

  const updateCart = (newCart: Product[]) => {
    setCart(newCart);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData: User = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
      fetchCart(userData.token); // Fetch cart data on initial load
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      cart,
      login,
      logout,
      updateUserProfile,
      updateCart
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
