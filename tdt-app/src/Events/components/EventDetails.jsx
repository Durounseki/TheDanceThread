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
        <div className="event-creator">
          {event.createdBy && (
            <>
              <figure className="profile-picture">
                <div
                  dangerouslySetInnerHTML={{ __html: event.createdBy.avatar }}
                />
              </figure>
              <div>
                <h2>Posted by</h2>
                <p>
                  <b>{event.createdBy.name}</b>
                </p>
              </div>
            </>
          )}
        </div>
        <div className="event-sns">
          <h2>Find more at</h2>
          <p>
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

        <div className="event-image">
          <img src={event.flyer.src} alt={event.flyer.alt} />
        </div>
        <div className="event-date">
          <i className="fa-regular fa-calendar"></i>
          <p>{dayjs(event.date).format("YYYY MMMM D")}</p>
        </div>
        <div className="event-interactions">
          <ul>
            <li>
              <i className="fa-solid fa-heart"></i>
              <p>{event.totalLikes}</p>
            </li>
            <li>
              <i className="fa-solid fa-people-group"></i>
              <p>{event.totalAttendees}</p>
            </li>
          </ul>
        </div>
        <div className="event-section">
          <h2>Details</h2>
          <p>{event.description}</p>
        </div>

        <div className="event-venue">
          <i className="fa-regular fa-map"></i>
          <p>
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
        </div>
        <section className="event-section">
          <h2>Artists</h2>
          <p>Coming soon!</p>
        </section>
        <section className="event-section">
          <h2>DJ's</h2>
          <p>Coming soon!</p>
        </section>
        <section className="event-section">
          <h2>Dancers</h2>

          {event.totalAttendees > 0 ? (
            event.attendees.map((item) => (
              <p key={item.user.id}>
                <b>{item.user.name}</b>
              </p>
            ))
          ) : (
            <p>No one here yet...</p>
          )}
        </section>
      </>
    );
  }
};

EventDetails.propTypes = {
  eventId: PropTypes.string.isRequired,
};

export default EventDetails;
