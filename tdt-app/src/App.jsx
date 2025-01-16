import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout.jsx";
import Home from "./Home.jsx";
import Events from "./Events/Events.jsx";
import CreateEvent from "./Events/CreateEvent.jsx";
import ErrorPage from "./ErrorPage.jsx";
import EventsSchedule from "./Events/EventsSchedule.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/events" element={<Events />}>
            <Route index element={<EventsSchedule />} />
            <Route path="create" element={<CreateEvent />} />
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
