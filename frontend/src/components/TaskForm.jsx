//Taskform - creating/editing task
import { useEffect, useState } from "react";
import AlertModal from "./AlertModal";
import { todayISO } from "../hooks/date";

export default function TaskForm({
  onSubmit,     
  onCancel,     
  submitting,   
  initialValues 
}) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [dueDate, setDueDate] = useState(initialValues?.dueDate ?? "");
  const [priority, setPriority] = useState(initialValues?.priority ?? "Medium");

  // Alert modal state for validation errors
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Update form fields when initialValues change
  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title ?? "");
      setDueDate(initialValues.dueDate ?? "");
      setPriority(initialValues.priority ?? "Medium");
    }
  }, [initialValues]);

  // Simple form validation
  function validate() {
    if (!title.trim()) {
      setAlertMessage("Please write a task title.");
      setAlertOpen(true);
      return false;
    }
    const today = todayISO();
    if (dueDate && dueDate < today) {
      setAlertMessage("Due date cannot be in the past.");
      setAlertOpen(true);
      return false;
    }
    return true;
  }

  return (
    <>
      <form
        noValidate // disable browser's built-in validation
        onSubmit={(e) => {
          e.preventDefault();
          if (!validate()) return;
          onSubmit?.({
            title,
            dueDate,
            priority,
            status: initialValues?.status ?? "In Progress"
          });
        }}
      >
        {/* Form field */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-text"
              placeholder="Task title"
            />
          </div>

          {/* Due date */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Due date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-text"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-text"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 justify-end pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-9 px-3 rounded-lg bg-iconbg text-text font-medium dark:text-text"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="h-9 px-4 rounded-lg bg-accent text-card font-medium disabled:opacity-60 dark:text-text"
          >
            Create
          </button>
        </div>
      </form>

     {/* Validation alert */}
      <AlertModal
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        title="Error"
        message={alertMessage}
        actionLabel="OK"
      />
    </>
  );
}
