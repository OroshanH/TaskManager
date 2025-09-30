// Header with theme toggle, filters, stats, and add-task
import { useEffect, useState, useCallback, useRef } from "react";
import { Sun, Moon, Plus, Menu, X, BarChart3 } from "lucide-react";
import FilterPopover from "./FilterPopover";

export default function Header({ onNewTask, onOpenStats, filters, onChangeFilters }) {
  const [theme, setTheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  // Load initial theme from localStorage and apply class to html
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const initial = saved || "light";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  // Apply and persist theme with localStorage
  const applyTheme = useCallback((next) => {
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }, []);

  // Toggle theme handler
  function toggleTheme() {
    applyTheme(theme === "light" ? "dark" : "light");
  }

  // Close menu on outside 
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
  const isDark = theme === "dark";



  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-header border-b border-border shadow-md h-16">
      <div className="max-w-5xl mx-auto h-full px-6">
        <div className="h-full flex items-center gap-3">
          <div className="flex items-center ml-0 lg:ml-12">
            <div className="text-3xl font-extrabold tracking-tight leading-none text-text whitespace-nowrap">
              Task Manager
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2 lg:gap-3">
            <FilterPopover filters={filters} onChangeFilters={onChangeFilters} />

            {/* Theme button outside hamburger menu */}
            <button
              onClick={toggleTheme}
              className="hidden lg:inline-flex h-9 w-9 items-center justify-center rounded-xl text-iconcolor border-border bg-iconbg hover:opacity-80 shadow-md"
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              title={`Switch to ${isDark ? "light" : "dark"} mode`}
            >
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Statistics button outside hamburger menu */}
            <button
              onClick={onOpenStats}
              className="hidden lg:inline-flex h-9 w-9 items-center justify-center rounded-xl text-iconcolor border-border bg-iconbg hover:opacity-80 shadow-md"
              aria-label="Statistics"
              title="Statistics"
            >
              <BarChart3 size={18} />
            </button>
            
            {/* hamburger menu */}
            <div className="relative lg:hidden">
              <button
                ref={btnRef}
                onClick={() => setMenuOpen(v => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Open menu"
                className="h-9 w-9 inline-flex items-center justify-center rounded-xl text-iconcolor border-border bg-iconbg hover:opacity-80 shadow-md"
                title="Menu"
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40 bg-black/40" />

                  <div
                    ref={menuRef}
                    role="menu"
                    className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-border bg-card shadow-lg p-2"
                  >
                    {/* Theme toggle inside hamburger menu */}
                    <button
                      onClick={() => {
                        toggleTheme();
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-header/60 text-text"
                      role="menuitem"
                      title="Toggle theme"
                    >
                      {isDark ? <Moon size={16} /> : <Sun size={16} />}
                      <span>Switch to {isDark ? "Light" : "Dark"} mode</span>
                    </button>

                    {/* Statistics button inside hamburger menu */}
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onOpenStats?.();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-header/60 text-text"
                      role="menuitem"
                      title="Statistics"
                    >
                      <BarChart3 size={16} />
                      <span>Statistics</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Add task button */}
            <button
              onClick={onNewTask}
              className="h-9 w-9 inline-flex items-center justify-center rounded-xl bg-accent text-white hover:opacity-90 shadow-md"
              aria-label="Add task"
              title="Add task"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
