import { useEffect, useState } from "react";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import useAuth from "../../useAuth";

const useEvent = (eventId) => {
  const { user } = useAuth;
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

const EventCard = ({ eventId, selectEvent }) => {
  const { event, loading } = useEvent(eventId);
  const [bookmark, setBookmark] = useState(false);
  const [shared, setShared] = useState(false);
  const handleSelectEvent = () => {
    console.log(eventId);
    selectEvent(eventId);
  };
  const handleBookmark = async (event) => {
    event.preventDefault();
    setBookmark(!bookmark);
  };
  const handleShare = async (event) => {
    event.preventDefault();
    const url = window.location.host + window.location.pathname + `/${eventId}`;
    try {
      await navigator.clipboard.writeText(url);
      setShared(true);
      console.log(`Copying ${url}`);
      setTimeout(() => {
        setShared(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };
  if (!loading) {
    return (
      <div className="event-card" onClick={handleSelectEvent}>
        <div className="event-date">
          <p>
            {dayjs(new Date(event.date))
              .format("MMMM")
              .toUpperCase()
              .slice(0, 3)}
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
        <div className="event-actions">
          <ul>
            <li>
              <a href="#" onClick={handleBookmark}>
                {!bookmark ? (
                  <i className="fa-regular fa-bookmark"></i>
                ) : (
                  <i className="fa-solid fa-bookmark"></i>
                )}
              </a>
            </li>
            <li>
              <a href="#" onClick={handleShare}>
                <i className="fa-solid fa-share-from-square"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
};

EventCard.propTypes = {
  eventId: PropTypes.string.isRequired,
  selectEvent: PropTypes.func.isRequired,
};

export default EventCard;
