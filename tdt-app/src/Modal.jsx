const Modal = ({ closeModal, children }) => {
  const handleClose = (event) => {
    event.preventDefault();
    closeModal();
  };
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="close-button" onClick={handleClose}>
          <i className="fa-solid fa-circle-xmark"></i>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
