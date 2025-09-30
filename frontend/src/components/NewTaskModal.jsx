// Modal - shows children when open is true, closes on backdrop click
export default function NewTaskModal({ open, onClose, children }) {
  if (!open) return null; // don't render anything when closed

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden 
      />

  
      <div
        className="absolute inset-x-4 top-20 rounded-2xl bg-header p-4 shadow max-w-md mx-auto"
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}
