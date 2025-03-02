import { useState, useEffect } from "react";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthenticateUser } from "../../userQueries";
import {
  useBookmarkEvent,
  useLikeEvent,
  useAttendEvent,
} from "../../userMutations";

const EventBanner = ({ eventInfo, isLoading }) => {
  // const queryClient = useQueryClient();
  // const user = queryClient.getQueryData(["currentUser"]);
  const { data: user, isLoading: userLoading } = useAuthenticateUser();
  const [bookmark, setBookmark] = useState(false);
  const bookmarkMutation = useBookmarkEvent(eventInfo.id);
  const [shared, setShared] = useState(false);
  const [like, setLike] = useState(false);
  const likeMutation = useLikeEvent(eventInfo.id);
  const [attend, setAttend] = useState(false);
  const attendMutation = useAttendEvent(eventInfo.id);
  useEffect(() => {
    if (user) {
      setBookmark(user.savedEvents.includes(eventInfo.id));
      setLike(user.likedEvents.includes(eventInfo.id));
      setAttend(
        user.eventsAttending.find((item) => item.eventId === eventInfo.id)
      );
    }
  }, [eventInfo, user]);
  const handleBookmark = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    bookmarkMutation.mutate(bookmark);
  };
  const handleLike = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    likeMutation.mutate(like);
  };
  const handleShare = async (event) => {
    event.preventDefault();
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
  const handleAttend = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    attendMutation.mutate(attend);
  };
  if (!isLoading && user) {
    return (
      <div className="event-banner">
        <div className="event-date">
          <i className="fa-regular fa-calendar"></i>
          <p>{dayjs(eventInfo.date).format("YYYY MMMM D")}</p>
        </div>
        <h2 className="event-name">{eventInfo.name.toUpperCase()}</h2>
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
      </div>
    );
  } else {
    return <></>;
  }
};

export default EventBanner;
