import EventForm from "./components/EventForm";

const CreateEvent = () => {
  return (
    <main className="create-event">
      <article>
        <h1 className="create-event-title">Add New Event</h1>
        <EventForm />
      </article>
    </main>
  );
};

export default CreateEvent;
