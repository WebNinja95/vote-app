export default function Notification({ message, onClose }) {
  return (
    <div className="notification-overlay">
      <div className="notification-container">
        <p>{message}</p>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
