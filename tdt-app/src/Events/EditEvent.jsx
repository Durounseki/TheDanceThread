import EventForm from "./components/EventForm";
import useAuth from "../useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EditEvent = () => {
  const { user } = useAuth;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/events");
    }
  });

  if (user) {
    return (
      <main className="edit-event">
        <article>
          <h2>Edit your event</h2>
          <EventForm />
        </article>
      </main>
    );
  }
};

export default EditEvent;
