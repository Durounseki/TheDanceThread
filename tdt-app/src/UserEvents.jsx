import { Link } from "react-router-dom";
import EventCard from "./Events/components/EventCard";
import { useEvents, useUserEvents } from "./eventQueries";

const UserEvents = ({ user, canEdit = false, showModal, setEventId }) => {
  const { data: events, isLoading: eventsLoading } = useEvents();
  const { data: userEvents, isLoading: userEventsLoading } = useUserEvents(
    user,
    events,
    { enabled: !!user && !!events }
  );
  return (
    <>
      <div className="events-created">
        <span className="events-section-title">Events Created</span>
        {userEvents &&
          userEvents.created.length > 0 &&
          userEvents.created.map((event) => (
            <EventCard
              key={event.id}
              eventInfo={event}
              canEdit={canEdit}
              showModal={showModal}
              setEventId={setEventId}
            />
          ))}

        <Link className="create-event-button" to="/events/create">
          New Event
        </Link>
      </div>
      <div className="events-going">
        <span className="events-section-title">Events I&apos;m Going To</span>
        {userEvents &&
          userEvents.attending.length > 0 &&
          userEvents.attending.map((event) => (
            <EventCard key={event.id} eventInfo={event} />
          ))}
      </div>
    </>
  );
};

export default UserEvents;
