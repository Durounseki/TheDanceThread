import { Navigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const ProtectedRoute = ({ route, children }) => {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(["currentUser"]);
  if (!user) {
    return <Navigate to={route} replace />;
  }
  return children;
};

export default ProtectedRoute;
