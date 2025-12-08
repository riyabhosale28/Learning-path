import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ restore auth state once when app loads
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  function login(userData, token) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }

  function logout() {
    localStorage.clear();
    setUser(null);
  }

  // ✅ prevent redirect flicker
  if (loading) {
    return <h3>Loading...</h3>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
