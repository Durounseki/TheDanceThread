import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
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
          <Login />
        </Modal>
      )}
      <Footer />
    </>
  );
};

export default Layout;
