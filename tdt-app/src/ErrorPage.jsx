import useAuth from "./useAuth.jsx";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const ErrorPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname);
    if (
      !user &&
      (location.pathname.startsWith("/profile") ||
        location.pathname.startsWith("/events/create") ||
        location.pathname.endsWith("/edit"))
    ) {
      navigate("/");
    }
  }, [user, location.pathname, navigate]);
  if (loading) {
    return <></>;
  }
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
