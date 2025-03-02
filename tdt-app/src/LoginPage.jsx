// import { useQueryClient } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import Login from "./Login";
import { useAuthenticateUser } from "./userQueries";
const LoginPage = () => {
  // const queryClient = useQueryClient();
  const { data: user, isLoading: userLoading } = useAuthenticateUser();
  if (user) {
    return <Navigate to="/profile" replace />;
  }
  if (userLoading) {
    return <p>Loading...</p>;
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
