import { LOCAL_STORAGE_KEYS } from "@/constants";
import { ipc } from "@/ipc/manager";
import type { ThemeMode } from "@/types/theme-mode";

export const DEFAULT_THEME: ThemeMode = "system";

export interface ThemePreferences {
  local: ThemeMode | null;
  source: ThemeMode;
}

export function resolveIsDarkMode(mode: ThemeMode): boolean {
  if (mode === "dark") {
    return true;
  }
  if (mode === "light") {
    return false;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function getStoredTheme(): ThemeMode {
  const localTheme = localStorage.getItem(
    LOCAL_STORAGE_KEYS.THEME
  ) as ThemeMode | null;

  if (localTheme === "dark" || localTheme === "light" || localTheme === "system") {
    return localTheme;
  }

  return DEFAULT_THEME;
}

export async function getCurrentTheme(): Promise<ThemePreferences> {
  const currentTheme = await ipc.client.theme.getCurrentThemeMode();

  return {
    source: currentTheme,
    local: getStoredTheme(),
  };
}

export async function setTheme(newTheme: ThemeMode) {
  await ipc.client.theme.setThemeMode(newTheme);
  localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, newTheme);
  updateDocumentTheme(resolveIsDarkMode(newTheme));
}

export async function syncWithLocalTheme() {
  await setTheme(getStoredTheme());
}

export function applyStoredTheme() {
  updateDocumentTheme(resolveIsDarkMode(getStoredTheme()));
}

export function subscribeToSystemThemeChanges(onChange: () => void) {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handler = () => {
    if (getStoredTheme() === "system") {
      onChange();
    }
  };

  mediaQuery.addEventListener("change", handler);
  return () => mediaQuery.removeEventListener("change", handler);
}

function updateDocumentTheme(isDarkMode: boolean) {
  if (isDarkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}
