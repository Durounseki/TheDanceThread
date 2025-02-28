import { useDeleteEvent } from "./eventMutations";

const ConfirmEventDelete = ({ eventId, userId, showModal, setEventId }) => {
  const deleteEvent = useDeleteEvent();
  const handleDelete = async (event) => {
    event.preventDefault();
    await deleteEvent.mutateAsync({ eventId, userId });
    showModal(false);
  };
  const handleClose = (event) => {
    event.preventDefault();
    showModal(false);
    setEventId(null);
  };

  return (
    <>
      <div className="confirm-delete">
        <h2>Are you sure?</h2>
        <p>This action cannot be undone</p>
        <form onSubmit={handleDelete} className="confirm-delete-actions">
          <input
            type="text"
            id="eventname"
            name="eventname"
            autoComplete="off"
            style={{ visibility: "hidden", position: "absolute" }}
          />
          <button onClick={handleClose}>Cancel</button>
          <button type="submit">I am sure</button>
        </form>
      </div>
    </>
  );
};

export default ConfirmEventDelete;
