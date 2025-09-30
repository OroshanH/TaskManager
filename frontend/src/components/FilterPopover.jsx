// Filter popover: lets the user pick completion, priority, and sort
import { useEffect, useRef, useState } from "react";
import { Filter as FilterIcon, ArrowUp, ArrowDown } from "lucide-react";

export default function FilterPopover({ filters, onChangeFilters, className = "" }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(() => ({
    completion: filters?.completion ?? "all",
    priority: filters?.priority ?? "all",
    sort: filters?.sort ?? "none",
  }));

  // Refs for outside-click detection
  const popRef = useRef(null);
  const btnRef = useRef(null);

  // Whether any filter is active to style the filter icon
  const hasActive =
    (filters?.completion && filters.completion !== "all") ||
    (filters?.priority && filters.priority !== "all") ||
    (filters?.sort && filters.sort !== "none");

  // Open the popover and sync draft with current filters
  function toggleOpen() {
    if (!open) {
      setDraft({
        completion: filters?.completion ?? "all",
        priority: filters?.priority ?? "all",
        sort: filters?.sort ?? "none",
      });
    }
    setOpen((s) => !s);
  }

  // Close on outside click only
  useEffect(() => {
    function onDocClick(e) {
      if (!open) return;
      if (
        popRef.current &&
        !popRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // Toggle handlers (click again to unselect)
  const toggleCompletion = (val) =>
    setDraft((d) => ({ ...d, completion: d.completion === val ? "all" : val }));

  const togglePriority = (val) =>
    setDraft((d) => ({ ...d, priority: d.priority === val ? "all" : val }));

  const toggleSort = (val) =>
    setDraft((d) => ({ ...d, sort: d.sort === val ? "none" : val }));

  // Apply changes to parent and close
  const applyAndClose = () => {
    onChangeFilters?.(draft);
    setOpen(false);
  };

  // Reset to defaults and close
  const resetAndClose = () => {
    const cleared = { completion: "all", priority: "all", sort: "none" };
    setDraft(cleared);
    onChangeFilters?.(cleared);
    setOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger button */}
      <button
        ref={btnRef}
        type="button"
        onClick={toggleOpen}
        className={[
          "h-8 w-8 inline-flex items-center justify-center text-iconcolor rounded-xl  border-border shadow-md hover:opacity-80",
          hasActive ? "bg-active" : "bg-iconbg"
        ].join(" ")}
        title="Filters"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <FilterIcon size={18} />
      </button>

      {/* Popover mounted as a centered overlay with a backdrop */}
      {open && (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/40"
            aria-hidden
            onClick={() => setOpen(false)}
          />

          {/* Popover panel */}
          <div
            ref={popRef}
            role="menu"
            className="absolute left-1/2 -translate-x-1/2 top-20 w-72 max-w-[calc(100vw-32px)] rounded-xl border border-border bg-header text-text shadow-lg p-3"
          >
            {/* Completion section */}
            <div className="mb-3">
              <div className="text-sm font-medium mb-2">Completion Status</div>
              <div className="grid grid-cols-2 gap-2">
                <FilterChip
                  active={draft.completion === "incomplete"}
                  onClick={() => toggleCompletion("incomplete")}
                  label="Active"
                />
                <FilterChip
                  active={draft.completion === "completed"}
                  onClick={() => toggleCompletion("completed")}
                  label="Completed"
                />
              </div>
            </div>

            {/* Priority section */}
            <div className="mb-3">
              <div className="text-sm font-medium mb-2">Priority</div>
              <div className="grid grid-cols-3 gap-2">
                <FilterChip
                  active={draft.priority === "Low"}
                  onClick={() => togglePriority("Low")}
                  label="Low"
                />
                <FilterChip
                  active={draft.priority === "Medium"}
                  onClick={() => togglePriority("Medium")}
                  label="Medium"
                />
                <FilterChip
                  active={draft.priority === "High"}
                  onClick={() => togglePriority("High")}
                  label="High"
                />
              </div>
            </div>

            {/* Sort section */}
            <div className="mb-1">
              <div className="text-sm font-medium mb-2">Sort by due date</div>
              <div className="grid grid-cols-2 gap-2">
                <FilterChip
                  active={draft.sort === "dueAsc"}
                  onClick={() => toggleSort("dueAsc")}
                  label="Ascending"
                  icon={<ArrowUp size={14} />}
                />
                <FilterChip
                  active={draft.sort === "dueDesc"}
                  onClick={() => toggleSort("dueDesc")}
                  label="Descending"
                  icon={<ArrowDown size={14} />}
                />
              </div>
            </div>

            {/* Footer actions */}
            <div className="mt-3 flex justify-end gap-2">
              <button
                className="text-xs px-3 py-1.5 rounded-lg bg-iconbg hover:opacity-90"
                onClick={resetAndClose}
              >
                Reset
              </button>
              <button
                className="text-card dark:text-text text-xs px-3 py-1.5 rounded-lg bg-accent  hover:opacity-90"
                onClick={applyAndClose}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* button prop */
function FilterChip({ active, onClick, label, icon }) {
  return (
    <button
      onClick={onClick}
      className={[
        "h-8 px-2 rounded-lg border text-xs inline-flex items-center justify-center gap-1",
        active ? "bg-accent text-white border-accent" : "bg-card border-border"
      ].join(" ")}
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      {label}
    </button>
  );
}
