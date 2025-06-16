import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Now correctly imported

const PrivateRoute = ({ role, Component }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== role) {
    // Redirect to their appropriate dashboard
    return <Navigate to={`/${user.role}`} />;
  }
  return <Component />;
};

export default PrivateRoute;
