import { useState, useEffect } from "react";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import useAuth from "../../useAuth";

const EventBanner = ({ event, isLoading }) => {
  const { user } = useAuth();
  const [bookmark, setBookmark] = useState(false);
  const [shared, setShared] = useState(false);
  const [like, setLike] = useState(false);
  const [attend, setAttend] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!isLoading && user) {
      if (event.totalSaves > 0) {
        const bookmarked = event.saves.find((item) => item.user.id === user.id);
        if (bookmarked) {
          setBookmark(true);
        } else {
          setBookmark(false);
        }
      } else {
        setBookmark(false);
      }
      if (event.totalLikes > 0) {
        const liked = event.likes.find((item) => item.user.id === user.id);
        if (liked) {
          setLike(true);
        } else {
          setLike(false);
        }
      } else {
        setLike(false);
      }
      if (event.totalAttendees > 0) {
        const attending = event.attendees.find(
          (item) => item.user.id === user.id
        );
        if (attending) {
          setAttend(true);
        } else {
          setAttend(false);
        }
      } else {
        setAttend(false);
      }
    }
  }, [event, isLoading, user]);
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
  const handleLike = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      if (!like) {
        await fetch(`${apiUrl}/events/${eventId}/likes`, {
          method: "POST",
          credentials: "include",
        });
      } else {
        await fetch(`${apiUrl}/events/${eventId}/likes`, {
          method: "DELETE",
          credentials: "include",
        });
      }
      setLike(!like);
    } catch (error) {
      console.error("Failed to like event", error);
    }
  };
  const handleShare = async (event) => {
    event.preventDefault();
    const url = window.location.host + window.location.pathname + `/${eventId}`;
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
  const handleAttend = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      if (!attend) {
        await fetch(`${apiUrl}/events/${eventId}/attendees`, {
          method: "POST",
          credentials: "include",
        });
      } else {
        await fetch(`${apiUrl}/events/${eventId}/attendees`, {
          method: "DELETE",
          credentials: "include",
        });
      }
      setAttend(!attend);
    } catch (error) {
      console.error("Failed to like event", error);
    }
  };
  if (!isLoading) {
    return (
      <div className="event-banner">
        <div className="event-date">
          <i className="fa-regular fa-calendar"></i>
          <p>{dayjs(event.date).format("YYYY MMMM D")}</p>
        </div>
        <h2 className="event-name">{event.name.toUpperCase()}</h2>
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
                <a href="#" onClick={handleLike}>
                  {!like ? (
                    <i className="fa-regular fa-heart"></i>
                  ) : (
                    <i className="fa-solid fa-heart"></i>
                  )}
                </a>
              </li>
              <li>
                <a href="#" onClick={handleShare}>
                  <i className="fa-solid fa-link"></i>
                </a>
              </li>
              <li>
                {!attend ? (
                  <button onClick={handleAttend}>Attend</button>
                ) : (
                  <div className="event-attendance">
                    <h2>Going</h2>
                    <a href="#" onClick={handleAttend}>
                      Cancel
                    </a>
                  </div>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>
    );
  }
};

export default EventBanner;
