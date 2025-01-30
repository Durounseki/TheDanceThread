import { Link } from "react-router-dom";
import mainLogo from "./assets/tdt-logo-dark.png";
const Header = () => {
  return (
    <>
      <header>
        <Link className="main-logo">
          <img src={mainLogo} alt="TDT" />
        </Link>
        <nav>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/events">Events</Link>
              </li>
              <li>
                <Link to="/events/create">New Event</Link>
              </li>
              <li>
                <Link to="/login">Get started</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
            </ul>
          </nav>
        </nav>
      </header>
    </>
  );
};

export default Header;
