//Taskcard component, checkmark, title, duedate, priority, delete, edit
import { memo, useEffect, useRef, useState } from "react";
import NewTaskModal from "./NewTaskModal";
import TaskForm from "./TaskForm";
import { useUpdateTaskMutation, useDeleteTaskMutation } from "../hooks/useTasks";
import { Pencil, Trash2, MoreVertical, Check } from "lucide-react";
import PriorityBadge from "./PriorityBadge";
import ConfirmModal from "./ConfirmModal";

// Format date -> ddmmyyyy
function formatDateDDMMYYYY(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d)) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

function TaskCard({ id, title, dueDate, priority, status }) {
  const [openEdit, setOpenEdit] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  // React Query mutations
  const { mutate: updateTask, isPending: saving } = useUpdateTaskMutation();
  const { mutate: deleteTask, isPending: deleting } = useDeleteTaskMutation();

  const isCompleted = status === "Completed";
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Save edits
  function handleSave(data) {
    updateTask(
      { id, data },
      { onSuccess: () => setOpenEdit(false), onError: () => alert("Failed to save task") }
    );
  }

  // Open confirm popup for delete
  function handleDelete() {
    setConfirmOpen(true);
  }

  // Toggle completed checkbox
  function handleToggleCompleted(e) {
    const next = e.target.checked ? "Completed" : "In Progress";
    updateTask({ id, data: { title, dueDate, priority, status: next } });
  }

  // Close kebab menu on outside click
 useEffect(() => {
  if (!menuOpen) return;

  function onDocClick(e) {
    const t = e.target;
    if (
      menuRef.current && !menuRef.current.contains(t) &&
      btnRef.current && !btnRef.current.contains(t)
    ) {
      setMenuOpen(false);
    }
  }

  document.addEventListener("mousedown", onDocClick);
  return () => {
    document.removeEventListener("mousedown", onDocClick);
  };
}, [menuOpen]);


  return (
    <>
      {/* task card, full width by default, lg and above w-60% and center cards */}
      <article
        className={`relative bg-card border border-border rounded-2xl p-4 shadow-sm transition
        ${isCompleted ? "opacity-60" : "opacity-100"}
        w-full lg:max-w-[60%] mx-auto`}
      >
        {/* Kebab menu*/}
        <button
          ref={btnRef}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => !v)}
          className="absolute top-2 right-3 p-1 text-muted hover:text-text focus:outline-none"
          title="More actions"
        >
          <MoreVertical size={18} />
        </button>

        {/* Priority badge */}
        <div className="absolute right-3 top-20">
          <PriorityBadge value={priority} size="md" />
        </div>

        {/* Layout */}
        <div className="grid grid-cols-[48px,1fr] gap-3 min-h-[100px] pr-12">
          {/* Checkbox */}
          <div className="flex items-center justify-center">
            <label
              htmlFor={`task-${id}-chk`}
              className="group inline-flex items-center justify-center cursor-pointer"
              title={isCompleted ? "Completed" : "Mark as completed"}
              aria-label={isCompleted ? "Mark as not completed" : "Mark as completed"}
            >
              <input
                id={`task-${id}-chk`}
                type="checkbox"
                checked={isCompleted}
                onChange={handleToggleCompleted}
                className="peer sr-only"
              />
              <span
                className="
                  h-7 w-7 rounded-full border border-border bg-bg shadow-inner
                  flex items-center justify-center transition
                  peer-checked:bg-greenborder peer-checked:border-green-300
                  dark:bg-white
                "
              >
                  <Check
                className="h-4 w-4 stroke-current text-text opacity-25 transition-opacity group-hover:opacity-40 peer-checked:text-white-100 peer-checked:opacity-100 dark:text-black"
                strokeWidth={3}
                aria-hidden="true"
                />
              </span>
            </label>
          </div>

          {/* title + due date */}
          <dl className="flex flex-col justify-center gap-3 min-w-0">
            <div className="min-w-0">
              <dt className="text-[11px] uppercase tracking-wide text-muted">Task title</dt>
              <dd className="text-base font-semibold text-text truncate" title={title}>
                {title || "—"}
              </dd>
            </div>

            <div className="min-w-0">
              <dt className="text-[11px] uppercase tracking-wide text-muted">Due date</dt>
              <dd className="text-sm font-medium text-text truncate" title={dueDate || ""}>
                {formatDateDDMMYYYY(dueDate)}
              </dd>
            </div>
          </dl>
        </div>

        {/* Kebab popover*/}
        {menuOpen && (
          <div
            ref={menuRef}
            role="menu"
            className="absolute right-3 top-8 w-40 rounded-xl border border-border bg-header shadow-lg overflow-hidden z-20"
          >
            <button
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                setOpenEdit(true);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text hover:bg-accent hover:text-white"
            >
              <Pencil size={16} /> Edit
            </button>
            <button
              role="menuitem"
              onClick={handleDelete}
              disabled={deleting}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-60"
            >
              <Trash2 size={16} /> {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        )}
      </article>

      {/* Edit modal */}
      <NewTaskModal open={openEdit} onClose={() => setOpenEdit(false)}>
        <h2 className="text-base font-bold mb-2 text-text">Edit task</h2>
        <TaskForm
          submitting={saving}
          submitLabel="Save changes"
          initialValues={{ title, dueDate, priority, status }}
          onSubmit={handleSave}
          onCancel={() => setOpenEdit(false)}
        />
      </NewTaskModal>

      {/* Confirm delete modal */}
      <ConfirmModal
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          deleteTask(id, { onError: () => alert("Failed to delete task") });
          setConfirmOpen(false);
          setMenuOpen(false);
        }}
        title="Confirm"
        message="Are you sure you want to delete this task?"
        cancelLabel="Cancel"
        confirmLabel="Delete"
      />
    </>
  );
}

export default memo(TaskCard);
