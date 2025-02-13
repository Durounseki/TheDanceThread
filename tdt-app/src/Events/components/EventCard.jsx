import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import useAuth from "../../useAuth";

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

const EventCard = ({ eventId, canEdit = false, showModal, setEventId }) => {
  const { user } = useAuth();
  const { event, loading } = useEvent(eventId);
  const [bookmark, setBookmark] = useState(false);
  const [shared, setShared] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const handleSelectEvent = () => {
    navigate(`/events/${eventId}`);
  };
  useEffect(() => {
    if (!loading && event.totalSaves > 0 && user) {
      const bookmarked = event.saves.find((item) => item.user.id === user.id);
      if (bookmarked) {
        setBookmark(true);
      }
    }
  }, [event, loading, user]);
  const handleBookmark = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      if (!bookmark) {
        await fetch(`${apiUrl}/events/${eventId}/saves`, {
          method: "POST",
          credentials: "include",
        });
      } else {
        await fetch(`${apiUrl}/events/${eventId}/saves`, {
          method: "DELETE",
          credentials: "include",
        });
      }
      setBookmark(!bookmark);
    } catch (error) {
      console.error("Failed to bookmark event", error);
    }
  };
  const handleShare = async (event) => {
    event.preventDefault();
    event.stopPropagation();
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
  const handleEdit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(`/events/${eventId}/edit`);
  };
  const handleRemove = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    showModal(true);
    setEventId(eventId);
  };
  if (!loading) {
    return (
      <div className="event-card-container">
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
          {user && (
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
                    <i className="fa-solid fa-link"></i>
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
        {canEdit && (
          <div className="edit-event-buttons">
            <ul>
              <li>
                <button onClick={handleEdit}>Edit</button>
              </li>
              <li>
                <button onClick={handleRemove}>Remove</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    );
  }
};

EventCard.propTypes = {
  eventId: PropTypes.string.isRequired,
  canEdit: PropTypes.bool,
};

export default EventCard;
