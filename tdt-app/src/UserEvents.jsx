import { Link } from "react-router-dom";
import EventCard from "./Events/components/EventCard";

const UserEvents = ({ user, canEdit = false }) => {
  return (
    <>
      <div className="events-created">
        <span className="events-section-title">Events Created</span>
        {user.eventsCreated.length > 0 &&
          user.eventsCreated.map((event) => (
            <EventCard key={event.id} eventId={event.id} canEdit={canEdit} />
          ))}

        <Link className="create-event-button" to="/events/create">
          New Event
        </Link>
      </div>
      <div className="events-going">
        <span className="events-section-title">Events I'm Going To</span>
        {user.eventsAttending.length > 0 &&
          user.eventsAttending.map((event) => (
            <EventCard key={event.id} eventId={event.eventId} />
          ))}
      </div>
    </>
  );
};

export default UserEvents;
