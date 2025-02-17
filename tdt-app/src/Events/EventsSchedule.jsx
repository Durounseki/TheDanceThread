import { useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import SearchEvent from "./components/Search.jsx";
import EventSchedule from "./components/EventSchedule.jsx";
import EventDetails from "./components/EventDetails.jsx";
import EventNotFound from "./components/EventNotFound.jsx";
import EventBanner from "./components/EventBanner.jsx";
import { useEvents, useFirstEvent } from "../eventQueries.js";

const EventsSchedule = () => {
  const { id: eventId } = useParams();
  console.log(eventId);
  const eventRef = useRef(null);
  const [searchParams] = useSearchParams();
  const country = searchParams.get("country");
  const style = searchParams.get("style");
  const date = searchParams.get("date");
  const { data: events, isLoading: eventsLoading } = useEvents(
    country,
    style,
    date
  );
  const { data: featuredEvent, isLoading: featuredEventLoading } =
    useFirstEvent(events, eventId);
  console.log("featuredEvent:", featuredEvent);

  useEffect(() => {
    if (eventId && eventRef.current) {
      eventRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });

  return (
    <>
      <main className="event-dashboard">
        <SearchEvent />
        <div className="schedule-separator"></div>
        <article className="event-container">
          <section className="event-details-container" ref={eventRef}>
            {featuredEvent ? (
              <EventDetails
                event={featuredEvent}
                isLoading={featuredEventLoading}
              />
            ) : (
              <EventNotFound />
            )}
          </section>
        </article>
        <aside className="event-schedule">
          <h2>Dance Events</h2>
          <EventSchedule events={events} isLoading={eventsLoading} />
        </aside>
      </main>
      {featuredEvent && (
        <EventBanner event={featuredEvent} isLoading={featuredEventLoading} />
      )}

      {/* <Outlet /> */}
    </>
  );
};

export default EventsSchedule;
