import {
  backupDb,
  exportJson,
  exportProcessMarkdown,
  getDashboardStats,
} from "./handlers";

export const workspace = {
  getDashboardStats,
  exportJson,
  exportProcessMarkdown,
  backupDb,
};
