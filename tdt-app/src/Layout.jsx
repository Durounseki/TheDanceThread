import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Modal from "./Modal.jsx";
import { useState } from "react";
import Login from "./Login.jsx";

const Layout = ({ loading }) => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
      <Header showLogin={setShowLogin} />
      {loading ? <p>Loading...</p> : <Outlet />}
      {showLogin && (
        <Modal>
          <Login closeLogin={setShowLogin} />
        </Modal>
      )}
      <Footer showLogin={setShowLogin} />
    </>
  );
};

export default Layout;
