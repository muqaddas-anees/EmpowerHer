import React, { createContext, useState, useContext, useEffect } from "react";

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state
  const [token, setToken] = useState(null); // Token state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state
  // Login function
  const login = (userData, authToken) => {
    setIsAuthenticated(true);
    setUser(userData);
    setToken(authToken);
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };
  useEffect(() => {
    // Check for token on initial load
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token) {
      // Optional: Validate token or decode it to confirm it's still valid
      setUser(JSON.parse(user));
      setIsAuthenticated(true);
    }
  }, []);
  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Usage example:
// import { AuthProvider, useAuth } from './AuthContext';

// Wrap your app with AuthProvider in the root file (e.g., index.js):
// <AuthProvider>
//   <App />
// </AuthProvider>

// Inside a component:
// const { user, token, login, logout } = useAuth();
