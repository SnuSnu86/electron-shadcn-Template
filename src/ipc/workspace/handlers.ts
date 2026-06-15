import { os } from "@orpc/server";
import { z } from "zod";
import {
  getDashboardStats as dbGetDashboardStats,
  getCurrentRole,
  setSetting,
} from "@/main/db/repository";
import {
  backupDatabase,
  exportAllJson,
  exportMarkdown,
} from "@/main/export/exporter";
import { ipcContext } from "../context";

export const getDashboardStats = os.handler(() => dbGetDashboardStats());

export const getRole = os.handler(() => getCurrentRole());

export const setRole = os
  .input(z.object({ role: z.enum(["viewer", "operator", "editor"]) }))
  .handler(({ input }) => {
    setSetting("role", input.role);
    return input.role;
  });

export const exportJson = os
  .use(ipcContext.mainWindowContext)
  .handler(({ context }) => exportAllJson(context.window));

export const exportProcessMarkdown = os
  .use(ipcContext.mainWindowContext)
  .input(z.object({ processId: z.number().int().positive().optional() }))
  .handler(({ context, input }) =>
    exportMarkdown(context.window, input.processId)
  );

export const backupDb = os
  .use(ipcContext.mainWindowContext)
  .handler(({ context }) => backupDatabase(context.window));
