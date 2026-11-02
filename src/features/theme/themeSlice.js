import { createSlice } from "@reduxjs/toolkit";

const getSavedTheme = () => {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem("nexus_theme");
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const initialTheme = getSavedTheme();

// Apply theme class immediately to prevent flash
if (typeof document !== "undefined") {
  if (initialTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    theme: initialTheme,
  },
  reducers: {
    toggleTheme: (state) => {
      const nextTheme = state.theme === "dark" ? "light" : "dark";
      state.theme = nextTheme;
      localStorage.setItem("nexus_theme", nextTheme);
      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    setTheme: (state, action) => {
      const nextTheme = action.payload;
      state.theme = nextTheme;
      localStorage.setItem("nexus_theme", nextTheme);
      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    loadTheme: (state) => {
      const saved = getSavedTheme();
      state.theme = saved;
      if (saved === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
  },
});

export const { toggleTheme, setTheme, loadTheme } = themeSlice.actions;
export default themeSlice.reducer;

