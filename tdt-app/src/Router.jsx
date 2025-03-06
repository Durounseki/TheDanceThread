import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout.jsx";
import Home from "./Home.jsx";
import Events from "./Events/Events.jsx";
import CreateEvent from "./Events/CreateEvent.jsx";
import EditEvent from "./Events/EditEvent.jsx";
import ErrorPage from "./ErrorPage.jsx";
import EventsSchedule from "./Events/EventsSchedule.jsx";
import LoginPage from "./LoginPage.jsx";
import Profile from "./Profile.jsx";
import TermsOfService from "./TermsOfService.jsx";
import PrivacyPolicy from "./PrivacyPolicy.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/events" element={<Events />}>
            <Route index element={<EventsSchedule />} />
            <Route
              path="create"
              element={
                <ProtectedRoute route="/events">
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
            <Route path=":id" element={<EventsSchedule />} />
            <Route
              path=":id/edit"
              element={
                <ProtectedRoute route="/events">
                  <EditEvent />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute route="/login">
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
