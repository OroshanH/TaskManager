//custom alert modal
import MessageModal from "./MessageModal";

export default function AlertModal({ open, onClose, title, message, actionLabel = "OK" }) {
  return (
    <MessageModal open={open} onClose={onClose} labelledById="alert-title">
      <h3 id="alert-title" className="text-lg font-semibold text-text mb-2">{title}</h3>
      <p className="text-sm text-muted mb-5">{message}</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg  bg-accent text-card dark:text-text"
        >
          {actionLabel}
        </button>
      </div>
    </MessageModal>
  );
}
