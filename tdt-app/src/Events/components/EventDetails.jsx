import dayjs from "dayjs";
import PropTypes from "prop-types";

const EventDetails = ({ event }) => {
  return (
    <>
      <h1 className="event-name">{event.name.toUpperCase()}</h1>
      <div className="event-image">
        <img src={event.flyer.src} alt={event.flyer.alt} />
      </div>
      <h2 className="event-headline">{event.description.headline}</h2>
      <p className="event-description">{event.description.body}</p>
      <p className="event-cta">{event.description.cta}</p>
      <div className="event-details">
        <p className="date">
          <i className="fa-regular fa-calendar"></i>
          {dayjs(event.date).format("YYYY MMMM D")}
        </p>
        <p className="venue">
          <i className="fa-regular fa-map"></i>
          {event.venue[0].url ? (
            <a
              href={event.venue[0].url}
              rel="noopener noreferrer"
              target="_blank"
            >
              {event.venue[0].name}
            </a>
          ) : (
            event.venue[0].name
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
    description: PropTypes.shape({
      headline: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      cta: PropTypes.string.isRequired,
    }).isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
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
  }).isRequired,
};

export default EventDetails;
