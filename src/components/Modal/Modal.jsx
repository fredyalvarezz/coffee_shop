import "./Modal.css";

export default function Modal({ children, onClose }) {
  return (
    <div className="modal" onClick={onClose}>
      <div
        className="modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal__close" onClick={onClose}>
           ✕
        </button>

        {children}
      </div>
    </div>
  );
}