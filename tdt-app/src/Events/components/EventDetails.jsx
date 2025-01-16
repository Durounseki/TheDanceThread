import { useState, useEffect } from "react";
import dayjs from "dayjs";
import PropTypes from "prop-types";

const useEvent = (eventId) => {
  const [event, setEvent] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/events/${eventId}`);
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.log("Failed to fetch event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl, eventId]);

  return { event, loading };
};

const EventDetails = ({ eventId }) => {
  const { event, loading } = useEvent(eventId);
  if (!loading) {
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
  }
};

EventDetails.propTypes = {
  eventId: PropTypes.string.isRequired,
};

export default EventDetails;
