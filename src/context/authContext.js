"use client";

import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Store user details

  useEffect(() => {
    // Check login state from localStorage when component mounts
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch user");

      const userData = await response.json();
      setUser(userData); // ✅ Store user info
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error fetching user:", error);
      logout();
    }
  };

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    fetchUser(token); // Fetch user details after login
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
