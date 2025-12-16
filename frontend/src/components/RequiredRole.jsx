import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RequiredRole({ children }) {
  const { user } = useContext(AuthContext);

  if (!user?.target_role) {
    return <Navigate to="/select-role" replace />;
  }

  return children;
}
