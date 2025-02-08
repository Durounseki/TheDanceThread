import PropTypes from "prop-types";
import EventCard from "./EventCard.jsx";

const EventSchedule = ({ eventIds }) => {
  return (
    <section className="event-cards">
      {eventIds && eventIds.length > 0 ? (
        eventIds.map((eventId) => <EventCard key={eventId} eventId={eventId} />)
      ) : (
        <p className="search-not-found">
          Sorry, there are no results that match{" "}
          <span>you search criteria</span>...
        </p>
      )}
    </section>
  );
};

EventSchedule.propTypes = {
  eventIds: PropTypes.arrayOf(PropTypes.string.isRequired),
};

export default EventSchedule;
