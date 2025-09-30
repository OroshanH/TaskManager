import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL = "http://localhost:8080/api/tasks";

//API calls
async function fetchTasks() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to load tasks");
  return res.json();
}

async function createTask(payload) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

async function updateTask({ id, data }) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete task");
  return true;
}

//Queries
// Fetch all tasks (cached under key ["tasks"])
export function useTasksQuery() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });
}

//Mutations
// Create task with optimistic update
export function useCreateTaskMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onMutate: async (newTask) => {
      // Cancel any ongoing queries to avoid overwriting
      await qc.cancelQueries({ queryKey: ["tasks"] });

      // Save current state for rollback
      const previous = qc.getQueryData(["tasks"]) || [];

      // Optimistically add new task with temporary id
      qc.setQueryData(["tasks"], [
        ...previous,
        { ...newTask, id: -Date.now() },
      ]);

      return { previous };
    },
    onError: (_err, _variables, context) => {
      // Roll back if server call fails
      if (context?.previous) qc.setQueryData(["tasks"], context.previous);
    },
    onSettled: () => {
      // Refetch to sync with server
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

// Update task with optimistic patch
export function useUpdateTaskMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateTask,
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: ["tasks"] });
      const previous = qc.getQueryData(["tasks"]) || [];

      // Optimistically update task in cache
      qc.setQueryData(
        ["tasks"],
        previous.map((t) => (t.id === id ? { ...t, ...data } : t))
      );

      return { previous };
    },
    onError: (_e, _vars, ctx) => {
      // Roll back on error
      if (ctx?.previous) qc.setQueryData(["tasks"], ctx.previous);
    },
    onSettled: () => {
      // Sync with server after success/error
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

// Delete task with optimistic removal
export function useDeleteTaskMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["tasks"] });
      const previous = qc.getQueryData(["tasks"]) || [];

      // Optimistically remove task from cache
      qc.setQueryData(["tasks"], previous.filter((t) => t.id !== id));

      return { previous };
    },
    onError: (_e, _id, ctx) => {
      // Roll back on error
      if (ctx?.previous) qc.setQueryData(["tasks"], ctx.previous);
    },
    onSettled: () => {
      // Ensure cache matches server
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
