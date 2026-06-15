import {
  backupDb,
  exportJson,
  exportProcessMarkdown,
  getDashboardStats,
  getRole,
  setRole,
} from "./handlers";

export const workspace = {
  getDashboardStats,
  getRole,
  setRole,
  exportJson,
  exportProcessMarkdown,
  backupDb,
};
