"use client";

import { createContext, useContext, useState, useEffect } from "react";

const RecommendationsContext = createContext();

export const RecommendationsProvider = ({ children }) => {
  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRecommendedSongs();
  }, []);

  const fetchRecommendedSongs = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/recommendations/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.ok) {
        const data = await response.json();
        setRecommendedSongs(data);
      } else {
        setError("Failed to fetch recommended songs");
      }
    } catch (err) {
      setError("An error occurred while fetching recommendations");
    }
  };
  

  return (
    <RecommendationsContext.Provider value={{ recommendedSongs, fetchRecommendedSongs, error }}>
      {children}
    </RecommendationsContext.Provider>
  );
};

export const useRecommendations = () => useContext(RecommendationsContext);
