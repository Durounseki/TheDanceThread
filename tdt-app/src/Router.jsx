import useAuth from "./useAuth.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout.jsx";
import Home from "./Home.jsx";
import Events from "./Events/Events.jsx";
import CreateEvent from "./Events/CreateEvent.jsx";
import ErrorPage from "./ErrorPage.jsx";
import EventsSchedule from "./Events/EventsSchedule.jsx";
import Login from "./Login.jsx";
import Profile from "./Profile.jsx";
import TermsOfService from "./TermsOfService.jsx";
import PrivacyPolicy from "./PrivacyPolicy.jsx";

const Router = () => {
  const { user, loading } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout loading={loading} />}>
          <Route index element={<Home />} />
          <Route path="/events" element={<Events />}>
            <Route index element={<EventsSchedule />} />
            {user && <Route path="create" element={<CreateEvent />} />}
          </Route>
          {!user && <Route path="/login" element={<Login />} />}
          {user && <Route path="/profile" element={<Profile />} />}
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
