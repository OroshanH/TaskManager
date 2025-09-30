//Modal for alert/confirm
import { useEffect } from "react";
export default function MessageModal({ open, onClose, children, labelledById }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-labelledby={labelledById}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
     <div className="relative w-full max-w-xs rounded-xl bg-card shadow-xl p-5">
  {children}
</div>

    </div>
  );
}
