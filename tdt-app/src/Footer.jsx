import { Link, useNavigate } from "react-router-dom";
// import { useQueryClient } from "@tanstack/react-query";
import { useAuthenticateUser } from "./userQueries";
import { useLogout } from "./userMutations";
const Footer = ({ showLogin }) => {
  // const queryClient = useQueryClient();
  // const user = queryClient.getQueryData(["currentUser"]);
  const { data: user, isLoading: userLoading } = useAuthenticateUser();
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const handleShowLogin = (event) => {
    event.preventDefault();
    showLogin(true);
  };
  const handleLogOut = async (event) => {
    event.preventDefault();
    navigate("/");
    logoutMutation.mutate(user.id);
  };
  const handleNewEvent = () => {
    navigate("/events/create");
  };
  return (
    <footer>
      <section className="footer-cta">
        <h2>Advertise your event</h2>
        {!user ? (
          <button onClick={handleShowLogin}>Get Started</button>
        ) : (
          <button onClick={handleNewEvent}>New Event</button>
        )}
      </section>
      <section className="site-map">
        <h3>Account</h3>
        {user && (
          <ul>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <a href="#" onClick={handleLogOut}>
                Logout
              </a>
            </li>
          </ul>
        )}
        {!user && (
          <ul>
            <li>
              <a href="#" onClick={handleShowLogin}>
                Sign up
              </a>
            </li>
          </ul>
        )}
        <h3>Discover</h3>
        <ul>
          <li>
            <Link to="/events">Events</Link>
          </li>
          <li>
            <Link to="/community">Community</Link>
          </li>
        </ul>
        <h3>The Dance Thread</h3>
        <ul>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <a href="/privacy-policy" rel="noopener noreferrer" target="_blank">
              Privacy Policy
            </a>
          </li>
          <li>
            <a
              href="/terms-of-service"
              rel="noopener noreferrer"
              target="_blank"
            >
              Terms of Service
            </a>
          </li>
        </ul>
      </section>
      <section className="tdt-sns">
        <p>
          <a
            href="https://www.instagram.com/thedancethread?igsh=b3c2M216eHNmNjh4"
            rel="noopener noreferrer"
            target="_blank"
          >
            <i className="fa-brands fa-instagram"></i>
          </a>
          <b>Follow us on Instagram</b>
        </p>
        <p>
          <b>Design by</b>
          <a
            href="https://www.esparzalopez.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            エルウエブ
          </a>
        </p>
        <p>
          <b>&copy; 2024 The Dance Thread</b>
        </p>
      </section>
    </footer>
  );
};

export default Footer;
