import { useMemo, useState, useEffect } from "react";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import NewTaskModal from "./components/NewTaskModal";
import TaskForm from "./components/TaskForm";
import StatsModal from "./components/StatsModal";
import { useTasksQuery, useCreateTaskMutation } from "./hooks/useTasks";
import AlertModal from "./components/AlertModal";

// List every task by default
const DEFAULT_FILTERS = {
  completion: "all",
  priority: "all",
  sort: "none",
};


export default function App() {
  const [showNew, setShowNew] = useState(false);
  const [showStats, setShowStats] = useState(false); 
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Persist filters with localstorage
  const [filters, setFilters] = useState(() => {
    try {
      const raw = localStorage.getItem("taskFilters");
      const parsed = raw ? JSON.parse(raw) : {};
      return { ...DEFAULT_FILTERS, ...parsed };
    } catch {
      return DEFAULT_FILTERS;
    }
  });

  useEffect(() => {
    localStorage.setItem("taskFilters", JSON.stringify(filters));
  }, [filters]);

  // React Query hooks: fetch all tasks (query) and create new tasks (mutation)
  const { data: tasks = [], isLoading, isError, error } = useTasksQuery();
  const { mutate: createTask, isPending: creating } = useCreateTaskMutation();

  // Handle creating a new task: call mutation, close modal on success, show alert on error
  function handleCreate(payload) {
    createTask(payload, {
      onSuccess: () => setShowNew(false),
      onError: (err) => {
        const serverMsg =
          err?.response?.data?.message ||
          err?.data?.message ||
          err?.message;
        setAlertMessage(serverMsg || "Failed to create task.");
        setAlertOpen(true);
      },
    });
  }

// Compute visible tasks (memoized):
// 1. Filter by completion + priority
// 2. Optionally sort by due date (asc/desc)
// 3. Otherwise, put incomplete tasks first, then completed
  const visibleTasks = useMemo(() => {
    const filtered = (tasks || []).filter((t) => {
      if (filters.completion === "completed" && t.status !== "Completed") return false;
      if (filters.completion === "incomplete" && t.status === "Completed") return false;

      if (
        filters.priority !== "all" &&
        (t.priority || "").toLowerCase() !== filters.priority.toLowerCase()
      )
        return false;

      return true;
    });

    const getDue = (x) => {
      if (!x?.dueDate) return null;
      const t = new Date(x.dueDate).getTime();
      return Number.isFinite(t) ? t : null;
    };

    if (filters.sort === "dueAsc" || filters.sort === "dueDesc") {
      const cmpAsc = (a, b) => {
        const ta = getDue(a),
          tb = getDue(b);
        if (ta === null && tb === null) return 0;
        if (ta === null) return 1;
        if (tb === null) return -1;
        return ta - tb;
      };
      const cmpDesc = (a, b) => {
        const ta = getDue(a),
          tb = getDue(b);
        if (ta === null && tb === null) return 0;
        if (ta === null) return 1;
        if (tb === null) return -1;
        return tb - ta;
      };
      return filtered.slice().sort(filters.sort === "dueAsc" ? cmpAsc : cmpDesc);
    }

    const withIndex = filtered.map((t, idx) => ({ t, idx }));
    withIndex.sort((A, B) => {
      const aCompleted = A.t.status === "Completed";
      const bCompleted = B.t.status === "Completed";
      if (aCompleted !== bCompleted) return aCompleted ? 1 : -1;
      return A.idx - B.idx;
    });

    return withIndex.map((x) => x.t);
  }, [tasks, filters]);

  return (
    <>
    {/*Render header with props (new task, open stats, filters)*/}
      <Header
        onNewTask={() => setShowNew(true)}
        onOpenStats={() => setShowStats(true)}
        filters={filters}
        onChangeFilters={setFilters}
      />
      {/*spacer div to offset the fixed header height.*/}
      <div className="h-[72px]" aria-hidden />


      {/*Message when loading/error fetching tasks*/}
      {isLoading ? (
        <div className="rounded-lg border border-border bg-card shadow-sm p-6 ml-6 mr-6 mt-6 text-text text-center font-medium">
          Loading tasks…
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-border bg-card shadow-sm p-6 ml-6 mr-6 mt-6  text-red-600 text-center font-medium ">
          Error: {String(error?.message || "Failed to load")}
        </div>
      ) : (
        <TaskList tasks={visibleTasks} />
      )}

      {/* Create Task modal */}
      <NewTaskModal open={showNew} onClose={() => setShowNew(false)}>
        <TaskForm
          submitLabel={creating ? "Creating…" : "Create task"}
          submitting={creating}
          onSubmit={handleCreate}
          onCancel={() => setShowNew(false)}
        />
      </NewTaskModal>

      {/* Statistics modal*/}
      <StatsModal open={showStats} onClose={() => setShowStats(false)} tasks={tasks || []} />

      {/* Alert modal for errors */}
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
