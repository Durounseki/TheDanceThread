const Modal = ({ children }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">{children}</div>
    </div>
  );
};

export default Modal;
