import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
// import { useQueryClient } from "@tanstack/react-query";
import { useAuthenticateUser } from "./userQueries";

const ErrorPage = () => {
  // const queryClient = useQueryClient();
  // const user = queryClient.getQueryData(["user"]);
  const { data: user, isLoading: userLoading } = useAuthenticateUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (
      !user &&
      (location.pathname.startsWith("/profile") ||
        location.pathname.startsWith("/events/create") ||
        location.pathname.endsWith("/edit"))
    ) {
      navigate("/");
    }
  }, [user, location.pathname, navigate]);

  return (
    <main className="error-page-content">
      <h1>It seems that you got lost...</h1>
      <p className="error-page-message">
        Go back to the <Link to="/">beginning</Link> or{" "}
        <Link to="/events">explore other events</Link>
      </p>
    </main>
  );
};

export default ErrorPage;
