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
        <div className="confirm-delete-actions">
          <button onClick={handleClose}>Cancel</button>
          <button onClick={handleDelete}>I am sure</button>
        </div>
      </div>
    </>
  );
};

export default ConfirmEventDelete;
