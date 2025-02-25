import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import TDTLogo from "./TDTLogo.jsx";
import Modal from "./Modal.jsx";
import Login from "./Login.jsx";
// import useAuth from "./useAuth.jsx";
import { useAuthenticateUser, useCurrentUser } from "./userQueries.js";
const Home = () => {
  const { data: user, isLoading: userLoading } = useAuthenticateUser();
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const handleNewEvent = (event) => {
    if (user) {
      navigate("/events/create");
    } else {
      event.preventDefault();
      setShowLogin(true);
    }
  };
  if (userLoading) {
    return <p>Loading...</p>;
  }
  return (
    <main className="home-page">
      <h1>WELCOME TO</h1>
      <TDTLogo />
      <h2>Dance, Discover, Connect...</h2>
      <div className="home-buttons">
        <ul>
          <li>
            <Link to="/events">Start exploring</Link>
          </li>
          <li>
            <a href="#" onClick={handleNewEvent}>
              New event
            </a>
          </li>
        </ul>
      </div>
      {showLogin && (
        <Modal closeModal={setShowLogin}>
          <Login />
        </Modal>
      )}
    </main>
  );
};

export default Home;
