import { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api"; // Your configured axios instance

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to get user profile
  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token); // Debugging line
      if (!token) {
        setUser(null);
        return;
      }

      // Make sure this endpoint matches your backend route
      const res = await api.get("/user/profile");
      setUser(res.data);
    } catch (error) {
      console.error("Profile fetch error:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Check authentication status on initial load
  useEffect(() => {
    getProfile();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, getProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
