import { useEffect, useState } from "react";
import SearchEvent from "./components/Search.jsx";
import EventSchedule from "./components/EventSchedule.jsx";
import EventDetails from "./components/EventDetails.jsx";
import EventNotFound from "./components/EventNotFound.jsx";

const useEventIds = () => {
  const [eventIds, setEventIds] = useState([]);
  const [featuredEventId, setFeaturedEventId] = useState("");
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/events`);
        const data = await response.json();
        setEventIds(data.map((event) => event.id));
        setFeaturedEventId(data[0].id);
      } catch (error) {
        console.log("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl]);

  return { eventIds, featuredEventId, loading };
};

const Events = () => {
  const { eventIds, featuredEventId, loading } = useEventIds();
  if (!loading) {
    return (
      <>
        <main className="event-dashboard">
          <aside className="event-schedule">
            <SearchEvent />
            <h2>Dance Events</h2>
            <EventSchedule eventIds={eventIds} />
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
      </>
    );
  }
};

export default Events;
