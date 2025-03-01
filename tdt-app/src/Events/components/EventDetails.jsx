import dayjs from "dayjs";
import PropTypes from "prop-types";
import EventNotFound from "./EventNotFound";
import ProgressiveImage from "../../ProgressiveImage";
import ResponsiveImage from "../../ResponsiveImage";

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

        <div className="event-image-container">
          <div className="event-image">
            <div className="skeleton-image" />
          </div>
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
                <ProgressiveImage
                  imageKey={event.createdBy.profilePic.src}
                  alt={event.createdBy.profilePic.alt}
                  size="small"
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

      <div className="event-image-container">
        <div className="event-image">
          <ResponsiveImage imageKey={event.flyer.src} alt={event.flyer.alt} />
        </div>
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
        <div className="event-styles">
          <ul>
            {event.styles.map((style) => (
              <li className="dance-style" key={style.id}>
                {style.name.charAt(0).toUpperCase() + style.name.slice(1)}
              </li>
            ))}
          </ul>
        </div>
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
        <h2>Dancers</h2>
        <ul className="event-dancers">
          {event.totalAttendees > 0 ? (
            event.attendees.map((attendee) => (
              <li key={attendee.user.id} className="attendee">
                <figure className="profile-picture">
                  {attendee.user.profilePic ? (
                    <ProgressiveImage
                      imageKey={attendee.user.profilePic.src}
                      alt={attendee.user.profilePic.alt}
                      size="small"
                    />
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: attendee.user.avatar,
                      }}
                    />
                  )}
                </figure>
                <p>
                  <b>{attendee.user.name}</b>
                </p>
              </li>
            ))
          ) : (
            <li>No one here yet...</li>
          )}
        </ul>
      </section>
      <section className="event-section">
        <h2>
          Artists <span>(Comming soon!)</span>
        </h2>
      </section>
      <section className="event-section">
        <h2>
          DJ&apos;s <span>(Comming soon!)</span>
        </h2>
      </section>
    </>
  );
};

export default EventDetails;
