import {
  backupDb,
  exportJson,
  exportProcessMarkdown,
  exportProcessPdf,
  getDashboardStats,
} from "./handlers";

export const workspace = {
  getDashboardStats,
  exportJson,
  exportProcessMarkdown,
  exportProcessPdf,
  backupDb,
};
