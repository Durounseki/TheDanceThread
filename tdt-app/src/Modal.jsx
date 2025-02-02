import { children } from "react";

const Modal = () => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">{children}</div>
    </div>
  );
};

export default Modal;
