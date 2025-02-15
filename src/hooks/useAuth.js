"use client";

import { useState, useEffect } from "react";

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Convert to boolean
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true); // Update state
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false); // Update state
  };

  return { isLoggedIn, login, logout };
};

export default useAuth;
