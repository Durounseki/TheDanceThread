import { Link } from "react-router-dom";
import dayjs from "dayjs";

const Events = () => {
  const events = null;
  const featuredEvent = null;
  return (
    <>
      <main className="event-dashboard">
        <aside className="event-schedule">
          <search>
            <form
              action="/events/search"
              method="POST"
              className="search-container"
            >
              <div className="searchbar">
                <div className="search" aria-label="Search">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <input
                  type="text"
                  name="country-search"
                  id="country-search"
                  placeholder="Search by country"
                />
                <button type="reset" className="clear-search">
                  <i className="fa-solid fa-circle-xmark"></i>
                </button>
              </div>
              <Link href="/events/create" className="create-button">
                <i className="fa-solid fa-plus"></i>
              </Link>
              <div className="filter-container">
                <p>Filter by</p>
                <div className="search-filter">
                  <select
                    name="style-search"
                    id="style-search"
                    data-style-value="<%= selectValue %>"
                  >
                    <option value="" selected>
                      Style
                    </option>
                    <option value="salsa">Salsa</option>
                    <option value="bachata">Bachata</option>
                    <option value="kizomba">Kizomba</option>
                    <option value="zouk">Zouk</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="date-filter">
                    <label htmlFor="date">Date:</label>
                    <input
                      type="month"
                      id="date-search"
                      name="date-search"
                      value="<%= dateValue %>"
                    />
                  </div>
                  <button type="submit" className="submit-search">
                    Filter
                  </button>
                </div>
              </div>
            </form>
          </search>
          <h2>Dance Events</h2>
          <div className="event-cards">
            {events ? (
              events.map((event) => {
                <div
                  key={event.id}
                  className="event-card"
                  data-event-id={event.id}
                >
                  <div className="event-date">
                    <p>
                      {dayjs(event.date)
                        .format("MMMM")
                        .toUpperCase()
                        .slice(0, 3)}
                    </p>
                    <p>{dayjs(event.date).format("D")}</p>
                  </div>
                  <div className="event-thumb">
                    <img src={event.flyer.src} alt={event.flyer.alt} />
                  </div>
                  <div className="event-details">
                    <p className="event-name">{event.name}</p>
                    <div className="event-links">
                      <p className="event-venue">
                        {event.venue[0].url ? (
                          <a
                            href={event.venue[0].url}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <i className="fa-regular fa-map"></i>{" "}
                            {event.country}
                          </a>
                        ) : (
                          <>
                            <i className="fa-regular fa-map"></i>{" "}
                            {event.country}
                          </>
                        )}
                      </p>
                      <p className="event-sns">
                        {event.sns.map((sns) => (
                          <a key={sns.id} href={sns.url} aria-label={sns.name}>
                            <i className={sns.faClass}></i>
                          </a>
                        ))}
                      </p>
                    </div>
                  </div>
                </div>;
              })
            ) : (
              <p className="search-not-found">
                Sorry, there are no results that match{" "}
                <span>you search criteria</span>...
              </p>
            )}
          </div>
        </aside>
        <article className="event-container">
          {featuredEvent ? (
            <div className="event-details-container">
              <h1 className="event-name">{featuredEvent.name.toUpperCase()}</h1>
              <div className="event-image">
                <img
                  src={featuredEvent.flyer.src}
                  alt={featuredEvent.flyer.alt}
                />
              </div>
              <h2 className="event-headline">
                {featuredEvent.description.headline}
              </h2>
              <p className="event-description">
                {featuredEvent.description.body}
              </p>
              <p className="event-cta">{featuredEvent.description.cta}</p>
              <div className="event-details">
                <p className="date">
                  <i className="fa-regular fa-calendar"></i>
                  {dayjs(featuredEvent.date).format("YYYY MMMM D")}
                </p>
                <p className="venue">
                  <i className="fa-regular fa-map"></i>
                  {featuredEvent.venue[0].url ? (
                    <a
                      href={featuredEvent.venue[0].url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {featuredEvent.venue[0].name}
                    </a>
                  ) : (
                    featuredEvent.venue[0].name
                  )}
                </p>
                <p className="sns">
                  {featuredEvent.sns.map((sns) => (
                    <a
                      key={sns.id}
                      href={sns.url}
                      aria-label={sns.name}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <i className={sns.faClass}></i>
                    </a>
                  ))}
                </p>
              </div>
            </div>
          ) : (
            <div className="event-details-container">
              <h1 className="no-match-title">No matching events</h1>
              <p className="no-match-message">
                Looks like we couldn&apos;t find any events that fit{" "}
                <span>those filters</span>.
              </p>
              <p className="no-match-cta">
                Don&apos;t give up! You can{" "}
                <a href="/events/create" className="create-link">
                  add your own event
                </a>
                to the list or{" "}
                <a href="/events" className="back-to-events">
                  see what else is happening
                </a>{" "}
                in the dance world.
              </p>
            </div>
          )}
        </article>
      </main>
    </>
  );
};

export default Events;
