import PropTypes from "prop-types";
import EventCard from "./EventCard.jsx";

const EventSchedule = ({ events, isLoading }) => {
  if (isLoading) {
    return (
      <section className="event-cards">
        <div className="event-card-container">
          <div className="event-card"></div>
        </div>
        <div className="event-card-container">
          <div className="event-card"></div>
        </div>
        <div className="event-card-container">
          <div className="event-card"></div>
        </div>
        <div className="event-card-container">
          <div className="event-card"></div>
        </div>
      </section>
    );
  }
  return (
    <section className="event-cards">
      {events && events.length > 0 ? (
        events.map((event) => <EventCard key={event.id} eventInfo={event} />)
      ) : (
        <p className="search-not-found">
          Sorry, there are no results that match{" "}
          <span>you search criteria</span>...
        </p>
      )}
    </section>
  );
};

export default EventSchedule;
