import { countProcesses, getSetting, setSetting } from "./repository";

/** Standard-Einstellungen beim ersten Start (ohne Demo-Prozesse). */
export function seedIfEmpty(): void {
  if (!getSetting("role")) {
    setSetting("role", "editor");
  }
  if (countProcesses() === 0 && !getSetting("seeded_at")) {
    setSetting("seeded_at", new Date().toISOString());
  }
}
