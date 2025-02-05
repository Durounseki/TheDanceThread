import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SearchEvent from "./components/Search.jsx";
import EventSchedule from "./components/EventSchedule.jsx";
import EventDetails from "./components/EventDetails.jsx";
import EventNotFound from "./components/EventNotFound.jsx";

const EventsSchedule = () => {
  const [featuredEventId, setFeaturedEventId] = useState(null);
  const [eventIds, setEventIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/events`);
        const data = await response.json();
        setEventIds(data.map((event) => event.id));
      } catch (error) {
        console.log("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (eventIds.length > 0 && !featuredEventId) {
      setFeaturedEventId(eventIds[0]);
    }
  }, [eventIds, featuredEventId]);

  const handleFeaturedEvent = (eventId) => {
    setFeaturedEventId(eventId);
  };

  if (!loading) {
    return (
      <>
        <main className="event-dashboard">
          <aside className="event-schedule">
            <SearchEvent
              setFeaturedEventId={setFeaturedEventId}
              setEventIds={setEventIds}
            />
            <h2>Dance Events</h2>
            <EventSchedule
              eventIds={eventIds}
              showFeaturedEvent={handleFeaturedEvent}
            />
          </aside>
          <article className="event-container">
            <section className="event-details-container">
              {featuredEventId ? (
                <EventDetails eventId={featuredEventId} />
              ) : (
                <EventNotFound />
              )}
            </section>
          </article>
        </main>
        <Outlet />
      </>
    );
  }
};

export default EventsSchedule;
