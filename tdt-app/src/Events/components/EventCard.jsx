import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import useAuth from "../../useAuth";
import ProgressiveImage from "../../ProgressiveImage";

const EventCard = ({ eventInfo, canEdit = false, showModal, setEventId }) => {
  const { user } = useAuth();
  const [bookmark, setBookmark] = useState(false);
  const [shared, setShared] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const handleSelectEvent = () => {
    navigate(`/events/${eventInfo.id}`);
  };
  useEffect(() => {
    if (eventInfo.totalSaves > 0 && user) {
      const bookmarked = eventInfo.saves.find(
        (item) => item.user.id === user.id
      );
      if (bookmarked) {
        setBookmark(true);
      }
    }
  }, [eventInfo, user]);
  const handleBookmark = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      if (!bookmark) {
        await fetch(`${apiUrl}/events/${eventInfo.id}/saves`, {
          method: "POST",
          credentials: "include",
        });
      } else {
        await fetch(`${apiUrl}/events/${eventInfo.id}/saves`, {
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
    const url =
      window.location.host + window.location.pathname + `/${eventInfo.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setShared(true);
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
    navigate(`/events/${eventInfo.id}/edit`);
  };
  const handleRemove = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    showModal(true);
    setEventId(eventInfo.id);
  };
  return (
    <div className="event-card-container">
      <div className="event-card" onClick={handleSelectEvent}>
        <div className="event-date">
          <p>
            {dayjs(new Date(eventInfo.date))
              .format("MMMM")
              .toUpperCase()
              .slice(0, 3)}
          </p>
          <p>{dayjs(new Date(eventInfo.date)).format("D")}</p>
        </div>
        <div className="event-thumb">
          <ProgressiveImage
            imageKey={eventInfo.flyer.src}
            alt={eventInfo.flyer.alt}
            size="small"
          />
        </div>
        <div className="event-details">
          <p className="event-name">{eventInfo.name}</p>
          <div className="event-links">
            <p className="event-venues">
              {eventInfo.venues[0].url ? (
                <a
                  href={eventInfo.venues[0].url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <i className="fa-regular fa-map"></i> {eventInfo.country}
                </a>
              ) : (
                <>
                  <i className="fa-regular fa-map"></i> {eventInfo.country}
                </>
              )}
            </p>
            <p className="event-sns">
              {eventInfo.sns.map((sns) => (
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
};

export default EventCard;
