import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function RequireAssessment({ children }) {
  const { user } = useContext(AuthContext);

  if (!user?.has_assessed) {
    return <Navigate to="/assessment" replace />;
  }

  return children;
}


