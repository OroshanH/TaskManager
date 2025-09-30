// Stats modal showing completed tasks per priority as a bar chart
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

function Modal({ open, onClose, children }) {
  if (!open) return null; // don't render when closed

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/50"
        onClick={onClose}
      />
      {/* Centered container */}
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          className="pointer-events-auto w-full max-w-2xl rounded-xl border border-border bg-card shadow-lg"
          onClick={(e) => e.stopPropagation()} // prevent backdrop close when clicking inside dialog
        >
          {/* Content */}
          <div className="p-4">{children}</div>
          {/* Footer */}
          <div className="flex justify-end p-4 border-t border-border">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-accent text-card dark:text-text hover:opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


export default function StatsModal({ open, onClose, tasks = [] }) {
  // Sum completed tasks by priority (memoized for perf)
  const completedByPriority = useMemo(() => {
  const result = { High: 0, Medium: 0, Low: 0 };
  for (const t of tasks) {
    if (t.status === "Completed" && (t.priority === "High" || t.priority === "Medium" || t.priority === "Low")) {
      result[t.priority]++;
    }
  }
  return result;
}, [tasks]);


  // Chart data
  const data = [
    { name: "High", value: completedByPriority.High },
    { name: "Medium", value: completedByPriority.Medium },
    { name: "Low", value: completedByPriority.Low },
  ];

  // css variables
  const COLORS = {
    High: "var(--color-redtext)",
    Medium: "var(--color-yellowborder)",
    Low: "var(--color-greenborder)",
  };

  const hasCompleted = data.some((d) => d.value > 0);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="h-80">
        <h3 className="text-sm font-semibold text-text mb-4">
          Completed Tasks by Priority
        </h3>

        {/* No tasks placeholder */}
        {!hasCompleted ? (
          <div className="p-6 ml-6 mr-6 mt-6 text-text text-center font-medium">
            No completed tasks yet.
          </div>
        ) : (
          // Responsive container keeps chart filling available space
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip cursor={false} />
              <Bar dataKey="value">
                {data.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Modal>
  );
}
