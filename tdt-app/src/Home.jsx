import { Link } from "react-router-dom";
import TDTLogo from "./TDTLogo.jsx";
const Home = () => {
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
            <Link to="/events/create">New Event</Link>
          </li>
        </ul>
      </div>
    </main>
  );
};

export default Home;
