import dayjs from "dayjs";
import PropTypes from "prop-types";
import EventNotFound from "./EventNotFound";

const EventDetails = ({ event, isLoading }) => {
  if (isLoading) {
    return (
      <>
        <h1 className="event-name">Loading...</h1>
        <div className="event-creator">
          <figure className="profile-picture"></figure>
          <div>
            <h2>Posted by</h2>
            <p>
              <b>Loading Name...</b>
            </p>
          </div>
        </div>
        <div className="event-sns">
          <h2>Find more at</h2>
          <p>
            {[...Array(4)].map((_, i) => (
              <a key={i} className="skeleton">
                <i className="fa-solid fa-circle"></i>
              </a>
            ))}
          </p>
        </div>

        <div className="event-image">
          <div className="skeleton-image" />
        </div>
        <div className="event-date">
          <i className="fa-regular fa-calendar"></i>
          <p>Loading Date...</p>
        </div>
        <div className="event-interactions">
          <ul>
            <li>
              <i className="fa-solid fa-heart"></i>
              <p>...</p>
            </li>
            <li>
              <i className="fa-solid fa-people-group"></i>
              <p>...</p>
            </li>
          </ul>
        </div>
        <div className="event-section">
          <h2>Details</h2>
          <p className="skeleton">Loading Description...</p>
        </div>

        <div className="event-venue">
          <i className="fa-regular fa-map"></i>
          <p>Loading Venue...</p>
        </div>
        <section className="event-section">
          <h2>Artists</h2>
          <p>Loading...</p>
        </section>
        <section className="event-section">
          <h2>DJ&apos;s</h2>
          <p>Loading...</p>
        </section>
        <section className="event-section">
          <h2>Dancers</h2>
          <p>Loading...</p>
        </section>
      </>
    );
  }
  if (!event) {
    return <EventNotFound />;
  }
  return (
    <>
      <h1 className="event-name">{event.name.toUpperCase()}</h1>
      <div className="event-creator">
        {event.createdBy && (
          <>
            <figure className="profile-picture">
              {event.createdBy.profilePic ? (
                <img
                  src={event.createdBy.profilePic.src}
                  alt={event.createdBy.profilePic.alt}
                />
              ) : (
                <div
                  dangerouslySetInnerHTML={{ __html: event.createdBy.avatar }}
                />
              )}
            </figure>
            <div>
              <h2>Posted by</h2>
              <p>
                <b>{event.createdBy.name}</b>
              </p>
            </div>
          </>
        )}
      </div>
      <div className="event-sns">
        <h2>Find more at</h2>
        <p>
          {event.sns.map((sns) => (
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

      <div className="event-image">
        <img src={event.flyer.src} alt={event.flyer.alt} />
      </div>
      <div className="event-date">
        <i className="fa-regular fa-calendar"></i>
        <p>{dayjs(event.date).format("YYYY MMMM D")}</p>
      </div>
      <div className="event-interactions">
        <ul>
          <li>
            <i className="fa-solid fa-heart"></i>
            <p>{event.totalLikes}</p>
          </li>
          <li>
            <i className="fa-solid fa-people-group"></i>
            <p>{event.totalAttendees}</p>
          </li>
        </ul>
      </div>
      <div className="event-section">
        <h2>Details</h2>
        <p>{event.description}</p>
      </div>

      <div className="event-venue">
        <i className="fa-regular fa-map"></i>
        <p>
          {event.venues[0].url ? (
            <a
              href={event.venues[0].url}
              rel="noopener noreferrer"
              target="_blank"
            >
              {event.venues[0].name}
            </a>
          ) : (
            event.venues[0].name
          )}
        </p>
      </div>
      <section className="event-section">
        <h2>Artists</h2>
        <p>Coming soon!</p>
      </section>
      <section className="event-section">
        <h2>DJ&apos;s</h2>
        <p>Coming soon!</p>
      </section>
      <section className="event-section">
        <h2>Dancers</h2>

        {event.totalAttendees > 0 ? (
          event.attendees.map((item) => (
            <p key={item.user.id}>
              <b>{item.user.name}</b>
            </p>
          ))
        ) : (
          <p>No one here yet...</p>
        )}
      </section>
    </>
  );
};

export default EventDetails;
