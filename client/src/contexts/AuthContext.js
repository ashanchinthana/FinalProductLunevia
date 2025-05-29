import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial auth state check

  // Simulate checking auth status on component mount (e.g., from localStorage, API)
  useEffect(() => {
    // Replace with actual auth checking logic
    // For example, check if a token exists in localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      // Here you would typically verify the token with a backend and get user info
      // For this example, we'll just simulate a logged-in user if a token exists
      setUser({ name: 'Demo User', token });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Replace with actual API call for login
    // For now, simulate a successful login
    return new Promise((resolve) => {
      setTimeout(() => {
        const fakeUser = { name: 'Logged In User', email };
        localStorage.setItem('authToken', 'fake-jwt-token'); // Store a dummy token
        setUser(fakeUser);
        resolve(fakeUser);
      }, 1000);
    });
  };

  const signup = async (name, email, password) => {
    // Replace with actual API call for signup
    // For now, simulate a successful signup
    return new Promise((resolve) => {
      setTimeout(() => {
        const fakeUser = { name, email };
        // Potentially log them in directly or store token
        localStorage.setItem('authToken', 'fake-jwt-token-signup');
        setUser(fakeUser);
        resolve(fakeUser);
      }, 1000);
    });
  };

  const logout = () => {
    // Replace with actual logout logic (e.g., invalidate token on backend)
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

// Custom Hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 