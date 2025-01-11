const EventNotFound = () => {
  return (
    <>
      <h2 className="no-match-title">No matching events</h2>
      <p className="no-match-message">
        Looks like we couldn&apos;t find any events that fit{" "}
        <span>those filters</span>.
      </p>
      <p className="no-match-cta">
        Don&apos;t give up! You can{" "}
        <a href="/events/create" className="create-link">
          add your own event
        </a>{" "}
        to the list or{" "}
        <a href="/events" className="back-to-events">
          see what else is happening
        </a>{" "}
        in the dance world.
      </p>
    </>
  );
};

export default EventNotFound;
