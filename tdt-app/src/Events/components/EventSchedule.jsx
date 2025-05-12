import PropTypes from "prop-types";
import EventCard from "./EventCard.jsx";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrAfter);

const EventSchedule = ({ events, isLoading }) => {
  if (isLoading) {
    return (
      <>
        <section className="event-cards">
          <h2>Upcoming Events</h2>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="event-card-container">
              <div className="event-card"></div>
            </div>
          ))}
        </section>
        <section className="event-cards">
          <h2>Past Events</h2>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="event-card-container">
              <div className="event-card"></div>
            </div>
          ))}
        </section>
      </>
    );
  }
  const now = dayjs().startOf("day");
  let upcomingEvents = [];
  let pastEvents = [];

  if (events && events.length > 0) {
    events.forEach((event) => {
      if (event && event.date) {
        const eventDate = dayjs(event.date).startOf("day");
        if (eventDate.isValid()) {
          if (eventDate.isSameOrAfter(now)) {
            upcomingEvents.push(event);
          } else {
            pastEvents.push(event);
          }
        }
      }
    });
  }
  pastEvents.reverse();

  const eventsByMonth = upcomingEvents.reduce((acc, event) => {
    const monthYear = dayjs(event.date).format("YYYY-MM");
    const displayMonthYear = dayjs(event.date).format("MMMM YYYY");
    if (!acc[monthYear]) {
      acc[monthYear] = {
        display: displayMonthYear,
        events: [],
      };
    }
    acc[monthYear].events.push(event);
    return acc;
  }, {});

  const sortedMonthKeys = Object.keys(eventsByMonth).sort();

  return (
    <>
      <section className="event-cards">
        <h2>Upcoming Events</h2>
        {upcomingEvents && upcomingEvents.length > 0 ? (
          sortedMonthKeys.map((monthKey) => (
            <>
              <h3>{eventsByMonth[monthKey].display}</h3>
              {eventsByMonth[monthKey].events.map((event) => (
                <EventCard key={event.id} eventInfo={event} />
              ))}
            </>
          ))
        ) : (
          <p className="search-not-found">
            Sorry, there are no results that match{" "}
            <span>you search criteria</span>...
          </p>
        )}
      </section>
      <section className="event-cards">
        <h2>Past Events</h2>
        {pastEvents && pastEvents.length > 0 ? (
          pastEvents.map((event) => (
            <EventCard key={event.id} eventInfo={event} />
          ))
        ) : (
          <p className="search-not-found">
            Sorry, there are no past events matching{" "}
            <span>you search criteria</span>...
          </p>
        )}
      </section>
    </>
  );
};

export default EventSchedule;
