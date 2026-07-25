import "./Modal.css";

export default function Modal({
  children,
  onClose,
  title,
}) {
  return (
    <div
      className="modal"
      onClick={onClose}
    >
      <div
        className="modal__content"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="modal__header">

          <h2>{title}</h2>

          <button
            className="modal__close"
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        <div className="modal__body">

          {children}

        </div>

      </div>
    </div>
  );
}