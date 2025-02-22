import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, route, children }) => {
  if (!user) {
    return <Navigate to={route} replace />;
  }
  return children;
};

export default ProtectedRoute;
