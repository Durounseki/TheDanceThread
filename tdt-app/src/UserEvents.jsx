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
        {userEvents && userEvents.created.length > 0 ? (
          userEventsLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="event-card-container">
                <div className="event-card"></div>
              </div>
            ))
          ) : (
            userEvents.created.map((event) => (
              <EventCard
                key={event.id}
                eventInfo={event}
                canEdit={canEdit}
                showModal={showModal}
                setEventId={setEventId}
              />
            ))
          )
        ) : (
          <p>You have not posted any event...</p>
        )}

        <Link className="create-event-button" to="/events/create">
          New Event
        </Link>
      </div>
      <div className="events-going">
        <span className="events-section-title">Events I&apos;m Going To</span>
        {userEvents && userEvents.attending.length > 0 ? (
          userEventsLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="event-card-container">
                <div className="event-card"></div>
              </div>
            ))
          ) : (
            userEvents.attending.map((event) => (
              <EventCard key={event.id} eventInfo={event} />
            ))
          )
        ) : (
          <p>You haven&apos;t interacted with any event...</p>
        )}
      </div>
    </>
  );
};

export default UserEvents;
