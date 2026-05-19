import "./Toast.css";

export default function Toast({
  message,
  type = "success",
  isVisible,
}) {

  if (!isVisible) return null;

  return (
    <div className="toast-overlay">

      <div className={`toast toast--${type}`}>
        {message}
      </div>

    </div>
  );
}