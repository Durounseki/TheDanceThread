import PropTypes from "prop-types";
import EventCard from "./EventCard.jsx";

const EventSchedule = ({ events }) => {
  return (
    <section className="event-cards">
      {events ? (
        events.map((event) => {
          <EventCard props={event} />;
        })
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
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      date: PropTypes.instanceOf(Date).isRequired,
      flyer: PropTypes.shape({
        src: PropTypes.string.isRequired,
        alt: PropTypes.string.isRequired,
      }).isRequired,
      country: PropTypes.string.isRequired,
      venue: PropTypes.arrayOf(
        PropTypes.shape({
          url: PropTypes.string,
          name: PropTypes.string.isRequired,
        })
      ).isRequired,
      sns: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
          faClass: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ),
};

export default EventSchedule;
