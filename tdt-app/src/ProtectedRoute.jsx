import { Navigate, useLocation } from "react-router-dom";
import { useAuthenticateUser } from "./userQueries";
import { useEffect } from "react";

const ProtectedRoute = ({ route, children }) => {
  const {
    data: user,
    isLoading: userLoading,
    isError,
    refetch,
  } = useAuthenticateUser();
  const location = useLocation();
  useEffect(() => {
    refetch();
  }, [refetch, location.pathname]);
  if (userLoading) {
    return <p>Loading...</p>;
  }
  if (isError || !user) {
    return <Navigate to={route} replace />;
  }
  return children;
};

export default ProtectedRoute;
