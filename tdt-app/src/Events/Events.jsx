import SearchEvent from "./components/Search.jsx";
import EventSchedule from "./components/EventSchedule.jsx";
import EventDetails from "./components/EventDetails.jsx";
import EventNotFound from "./components/EventNotFound.jsx";

const Events = () => {
  const events = null;
  const featuredEvent = null;
  return (
    <>
      <main className="event-dashboard">
        <aside className="event-schedule">
          <SearchEvent />
          <h2>Dance Events</h2>
          <EventSchedule props={events} />
        </aside>
        <article className="event-container">
          <section className="event-details-container">
            {featuredEvent ? (
              <EventDetails props={featuredEvent} />
            ) : (
              <EventNotFound />
            )}
          </section>
        </article>
      </main>
    </>
  );
};

export default Events;
