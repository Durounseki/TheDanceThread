import { useNavigate } from "react-router-dom";
import { useDeleteUser } from "./userMutations";

const ConfirmUserDelete = ({ userId, showModal }) => {
  const navigate = useNavigate();
  const deleteUser = useDeleteUser();
  const handleDelete = async () => {
    deleteUser.mutate(userId);
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
        <div className="confirm-delete-actions">
          <button onClick={handleClose}>Cancel</button>
          <button onClick={handleDelete}>I am sure</button>
        </div>
      </div>
    </>
  );
};

export default ConfirmUserDelete;
