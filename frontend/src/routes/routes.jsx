import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // Example auth check (adjust to your logic)
  const isAuthenticated = localStorage.getItem("authToken");

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;