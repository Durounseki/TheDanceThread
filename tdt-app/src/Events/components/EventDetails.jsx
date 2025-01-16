import dayjs from "dayjs";
import PropTypes from "prop-types";

const EventDetails = ({ event }) => {
  console.log("Event details:", event);
  return (
    <>
      <h1 className="event-name">{event.name.toUpperCase()}</h1>
      <div className="event-image">
        <img src={event.flyer.src} alt={event.flyer.alt} />
      </div>
      <p>{event.description}</p>
      <div className="event-details">
        <p className="date">
          <i className="fa-regular fa-calendar"></i>
          {dayjs(event.date).format("YYYY MMMM D")}
        </p>
        <p className="venue">
          <i className="fa-regular fa-map"></i>
          {event.venues[0].url ? (
            <a
              href={event.venues[0].url}
              rel="noopener noreferrer"
              target="_blank"
            >
              {event.venues[0].name}
            </a>
          ) : (
            event.venues[0].name
          )}
        </p>
        <p className="sns">
          {event.sns.map((sns) => (
            <a
              key={sns.id}
              href={sns.url}
              aria-label={sns.name}
              rel="noopener noreferrer"
              target="_blank"
            >
              <i className={sns.faClass}></i>
            </a>
          ))}
        </p>
      </div>
    </>
  );
};

EventDetails.propTypes = {
  event: PropTypes.shape({
    name: PropTypes.string.isRequired,
    flyer: PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
    }).isRequired,
    description: PropTypes.string.isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
    venues: PropTypes.arrayOf(
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
  }).isRequired,
};

export default EventDetails;
