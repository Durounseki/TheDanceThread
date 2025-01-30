import "./App.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout.jsx";
import Home from "./Home.jsx";
import Events from "./Events/Events.jsx";
import CreateEvent from "./Events/CreateEvent.jsx";
import ErrorPage from "./ErrorPage.jsx";
import EventsSchedule from "./Events/EventsSchedule.jsx";
import Login from "./Login.jsx";
import Profile from "./Profile.jsx";

function App() {
  const authClientId = import.meta.env.VITE_AUTH_GOOGLE_ID;
  return (
    <GoogleOAuthProvider clientId={authClientId}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/events" element={<Events />}>
              <Route index element={<EventsSchedule />} />
              <Route path="create" element={<CreateEvent />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
