//custom confirm modal
import MessageModal from "./MessageModal";

export default function ConfirmModal({
  open,
  onCancel,
  onConfirm,
  title = "Confirm",
  message,
  cancelLabel,
  confirmLabel,
}) {
  return (
    <MessageModal open={open} onClose={onCancel} labelledById="confirm-title">
      <h3 id="confirm-title" className="text-lg font-semibold text-text mb-2">{title}</h3>
      <p className="text-sm text-muted mb-5">{message}</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-accent text-card text-sm hover:opacity-90 dark:text-text"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-lg  bg-red-600 text-card text-sm hover:opacity-90 dark:text-text  dark:bg-red-700"
        >
          {confirmLabel}
        </button>
      </div>
    </MessageModal>
  );
}
