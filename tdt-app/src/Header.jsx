import { Link, useNavigate } from "react-router-dom";
import mainLogo from "./assets/tdt-logo-dark.png";
import useAuth from "./useAuth.jsx";
import { useState, useEffect, useRef } from "react";
import ProgressiveImage from "./ProgressiveImage.jsx";
const Header = ({ showLogin }) => {
  const { user, logout } = useAuth();
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  const handleShowLogin = (event) => {
    event.preventDefault();
    showLogin(true);
  };
  const toggleProfileMenu = (event) => {
    event.preventDefault();
    setOpenProfileMenu(!openProfileMenu);
  };
  const handleLogOut = async (event) => {
    event.preventDefault();
    navigate("/");
    await logout();
  };
  const handleOpenProfile = (event) => {
    event.preventDefault();
    setOpenProfileMenu(!openProfileMenu);
    navigate("/profile");
  };

  useEffect(() => {
    function handClickOutside(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setOpenProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handClickOutside);

    return () => {
      document.removeEventListener("mousedown", handClickOutside);
    };
  }, [profileMenuRef]);

  return (
    <>
      <header>
        <Link to="/" className="main-logo">
          <img src={mainLogo} alt="TDT" />
        </Link>
        <nav>
          <nav>
            <ul>
              <li>
                <Link to="/events">Events</Link>
              </li>
              {user && (
                <li>
                  <Link to="/events/create">New Event</Link>
                </li>
              )}
              {!user && (
                <li>
                  <a href="#" onClick={handleShowLogin}>
                    Get started
                  </a>
                </li>
              )}
              {user && (
                <li className="profile-tab" ref={profileMenuRef}>
                  <a href="#" onClick={toggleProfileMenu}>
                    <figure className="profile-picture">
                      {user.profilePic ? (
                        <ProgressiveImage
                          key={user.profilePic.src}
                          alt={user.profilePic.alt}
                          size="small"
                        />
                      ) : (
                        <div
                          dangerouslySetInnerHTML={{ __html: user.avatar }}
                        />
                      )}
                    </figure>
                  </a>
                  {openProfileMenu && (
                    <ul className="profile-actions">
                      <li>
                        <a href="#" onClick={handleOpenProfile}>
                          Edit
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={handleLogOut}>
                          Logout
                        </a>
                      </li>
                    </ul>
                  )}
                </li>
              )}
            </ul>
          </nav>
        </nav>
      </header>
    </>
  );
};

export default Header;
