import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SearchEvent from "./components/Search.jsx";
import EventSchedule from "./components/EventSchedule.jsx";
import EventDetails from "./components/EventDetails.jsx";
import EventNotFound from "./components/EventNotFound.jsx";
import EventBanner from "./components/EventBanner.jsx";

const EventsSchedule = () => {
  const { id: eventId } = useParams();
  console.log(eventId);
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
    if (eventId) {
      setFeaturedEventId(eventId);
    } else if (eventIds.length > 0 && !featuredEventId) {
      setFeaturedEventId(eventIds[0]);
    }
  }, [eventIds, featuredEventId, eventId]);

  if (!loading) {
    return (
      <>
        <main className="event-dashboard">
          <SearchEvent
            setFeaturedEventId={setFeaturedEventId}
            setEventIds={setEventIds}
          />
          <div className="schedule-separator"></div>
          <article className="event-container">
            <section className="event-details-container">
              {featuredEventId ? (
                <EventDetails eventId={featuredEventId} />
              ) : (
                <EventNotFound />
              )}
            </section>
          </article>
          <aside className="event-schedule">
            <h2>Dance Events</h2>
            <EventSchedule eventIds={eventIds} />
          </aside>
        </main>
        {featuredEventId && <EventBanner eventId={featuredEventId} />}

        {/* <Outlet /> */}
      </>
    );
  }
};

export default EventsSchedule;
