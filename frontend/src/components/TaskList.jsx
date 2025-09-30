//tasklist - render tasks with Virtuoso
import { Virtuoso } from "react-virtuoso";
import TaskCard from "./TaskCard";

export default function TaskList({ tasks }) {
  return (
    <section className="min-h-dvh">
      <div className="w-full mx-auto px-4 py-4">
        {/* Virtuoso: virtualized list for performance with many tasks */}
        <Virtuoso
          data={tasks}
          useWindowScroll 
          increaseViewportBy={{ top: 300, bottom: 600 }} 
          itemKey={(index, item) => item?.id ?? index} 
          itemContent={(index, t) => (
            <div className="mb-3 pb-2">
              <TaskCard
                id={t.id}
                title={t.title}
                dueDate={t.dueDate}
                priority={t.priority}
                status={t.status}
              />
            </div>
          )}
          components={{
            // placeholder when there are no tasks
            EmptyPlaceholder: () => (
              <div className="mb-3 pb-2">
                <div className="rounded-lg border border-border bg-card shadow-sm p-6 text-center">
                  <p className="text-base font-medium text-text">
                    No tasks found.
                  </p>
                </div>
              </div>
            ),
          }}
        />
      </div>
    </section>
  );
}
