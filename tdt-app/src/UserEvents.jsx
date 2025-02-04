import { Link } from "react-router-dom";
import EventCard from "./Events/components/EventCard";

const UserEvents = ({ user }) => {
  return (
    <section className="details-events">
      {user.eventsCreated.length > 0 || user.eventsAttending.length > 0 ? (
        <>
          {user.eventsCreated.length > 0 && (
            <div className="events-created">
              <span className="events-section-title">Events Created</span>
              {user.eventsCreated.map((event) => (
                <EventCard key={event.id} eventId={event.id} />
              ))}
              <Link className="create-event-button" to="/events/create">
                Create Event
              </Link>
            </div>
          )}

          {user.eventsAttending.length > 0 && (
            <div className="events-going">
              <span className="events-section-title">Events I'm Going To</span>
              {user.eventsAttending.map((event) => (
                <EventCard key={event.id} eventId={event.id} />
              ))}
            </div>
          )}
        </>
      ) : (
        <h2>No events yet</h2>
      )}
    </section>
  );
};

export default UserEvents;
