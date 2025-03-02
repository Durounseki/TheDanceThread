import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import ProgressiveImage from "../../ProgressiveImage";
import { useQueryClient } from "@tanstack/react-query";
import { useBookmarkEvent } from "../../userMutations";
import { useAuthenticateUser } from "../../userQueries";

const EventCard = ({ eventInfo, canEdit = false, showModal, setEventId }) => {
  // const queryClient = useQueryClient();
  // const user = queryClient.getQueryData(["currentUser"]);
  const { data: user, isLoading: userLoading } = useAuthenticateUser();
  const [bookmark, setBookmark] = useState(false);
  const bookmarkMutation = useBookmarkEvent(eventInfo.id);
  const [shared, setShared] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setBookmark(user.savedEvents.includes(eventInfo.id));
    }
  }, [user, eventInfo]);

  const handleSelectEvent = () => {
    navigate(`/events/${eventInfo.id}`);
  };

  const handleBookmark = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    bookmarkMutation.mutate(bookmark);
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
