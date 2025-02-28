import { useNavigate } from "react-router-dom";
import { useDeleteUser } from "./userMutations";

const ConfirmUserDelete = ({ userId, showModal }) => {
  const navigate = useNavigate();
  const deleteUser = useDeleteUser();
  const handleDelete = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    deleteUser.mutate({ userId, formData });
    navigate("/");
    showModal(false);
  };
  const handleClose = (event) => {
    event.preventDefault();
    showModal(false);
  };

  return (
    <>
      <div className="confirm-delete">
        <h2>Are you sure?</h2>
        <p>This action cannot be undone</p>
        <form onSubmit={handleDelete} className="confirm-delete-actions">
          <input
            type="text"
            id="username"
            name="username"
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

export default ConfirmUserDelete;
