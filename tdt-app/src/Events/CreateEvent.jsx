import EventForm from "./components/EventForm";
import useAuth from "../useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const { user } = useAuth;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/events");
    }
  });

  if (user) {
    return (
      <main className="create-event">
        <article>
          <h1 className="create-event-title">Add New Event</h1>
          <EventForm />
        </article>
      </main>
    );
  }
};

export default CreateEvent;
