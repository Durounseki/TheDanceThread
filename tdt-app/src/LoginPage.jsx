import { useQueryClient } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import Login from "./Login";
const LoginPage = () => {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(["currentUser"]);
  if (user) {
    return <Navigate to="/profile" replace />;
  }
  return (
    <main className="login-page">
      <article className="login-content">
        <Login />
      </article>
    </main>
  );
};

export default LoginPage;
