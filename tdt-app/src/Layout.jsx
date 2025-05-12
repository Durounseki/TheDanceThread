import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Modal from "./Modal.jsx";
import { useState } from "react";
import Login from "./Login.jsx";

const Layout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isLoginModalOpen = searchParams.get("login") === "true";
  const openLoginModal = () => {
    setSearchParams(
      (prev) => {
        prev.set("login", "true");
        return prev;
      },
      { replace: false }
    );
  };
  const closeLoginModal = () => {
    setSearchParams((prev) => {
      prev.delete("login");
      return prev;
    });
  };

  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  return (
    <>
      {!isHome && <Header showLogin={openLoginModal} />}
      <Outlet showLogin={openLoginModal} />
      {isLoginModalOpen && (
        <Modal closeModal={closeLoginModal}>
          <Login />
        </Modal>
      )}
      {!isHome && <Footer showLogin={openLoginModal} />}
    </>
  );
};

export default Layout;
