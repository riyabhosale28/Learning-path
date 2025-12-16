/*import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  return user ? children : <Navigate to="/login" />;
}*/



import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  // 1️⃣ Not logged in → login
  if (!user) {
    return <Navigate to="/login" replace/>;
  }

 
  return children;
}

