import { useNavigate } from "react-router-dom";

const ConfirmUserDelete = ({ userId, showModal }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const handleDelete = async () => {
    try {
      await fetch(`${apiUrl}/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      showModal(false);
      navigate(`/profile`);
    } catch (error) {
      console.error("Failed to remove user", error);
    }
  };
  const handleClose = (event) => {
    event.preventDefault();
    showModal(false);
  };

  return (
    <>
      <div className="confirm-delete">
        <button className="close-button" onClick={handleClose}>
          <i className="fa-solid fa-circle-xmark"></i>
        </button>
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

export default ConfirmUserDelete;
