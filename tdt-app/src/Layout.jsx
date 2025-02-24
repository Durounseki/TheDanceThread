import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Modal from "./Modal.jsx";
import { useState } from "react";
import Login from "./Login.jsx";

const Layout = ({ loading }) => {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  return (
    <>
      {!isHome && <Header showLogin={setShowLogin} />}
      {loading ? <p>Loading...</p> : <Outlet showLogin={setShowLogin} />}
      {showLogin && (
        <Modal closeModal={setShowLogin}>
          <Login />
        </Modal>
      )}
      {!isHome && <Footer showLogin={setShowLogin} />}
    </>
  );
};

export default Layout;
