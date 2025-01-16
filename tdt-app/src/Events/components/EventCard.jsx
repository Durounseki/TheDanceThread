import dayjs from "dayjs";
import PropTypes from "prop-types";

const EventCard = ({ event }) => {
  return (
    <div className="event-card" data-event-id={event.id}>
      <div className="event-date">
        <p>
          {dayjs(new Date(event.date)).format("MMMM").toUpperCase().slice(0, 3)}
        </p>
        <p>{dayjs(new Date(event.date)).format("D")}</p>
      </div>
      <div className="event-thumb">
        <img src={event.flyer.src} alt={event.flyer.alt} />
      </div>
      <div className="event-details">
        <p className="event-name">{event.name}</p>
        <div className="event-links">
          <p className="event-venues">
            {event.venues[0].url ? (
              <a
                href={event.venues[0].url}
                rel="noopener noreferrer"
                target="_blank"
              >
                <i className="fa-regular fa-map"></i> {event.country}
              </a>
            ) : (
              <>
                <i className="fa-regular fa-map"></i> {event.country}
              </>
            )}
          </p>
          <p className="event-sns">
            {event.sns.map((sns) => (
              <a key={sns.id} href={sns.url} aria-label={sns.name}>
                <i className={sns.faClass}></i>
              </a>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    flyer: PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
    }).isRequired,
    country: PropTypes.string.isRequired,
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

export default EventCard;
