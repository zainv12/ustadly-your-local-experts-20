import { useEffect, useState, useCallback } from "react";

export type Theme = "dark" | "light";
const KEY = "ustaadly:theme";

function apply(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("light", theme === "light");
  root.classList.toggle("dark", theme === "dark");
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = (typeof localStorage !== "undefined" && (localStorage.getItem(KEY) as Theme | null)) || "dark";
    setTheme(saved);
    apply(saved);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      try { localStorage.setItem(KEY, next); } catch { /* noop */ }
      apply(next);
      return next;
    });
  }, []);

  return { theme, toggle };
}
