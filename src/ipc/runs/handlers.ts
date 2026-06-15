import { os } from "@orpc/server";
import { z } from "zod";
import {
  getLogs as dbGetLogs,
  getRun as dbGetRun,
  listRecentRuns as dbListRecentRuns,
  listRunsByProcess as dbListRunsByProcess,
} from "@/main/db/repository";
import { cancelRun, startProcessRun } from "@/main/execution/executor";

const startRunSchema = z.object({
  processId: z.number().int().positive(),
  overrides: z.record(z.string(), z.string()),
});

const runIdSchema = z.object({ runId: z.number().int().positive() });

export const startRun = os
  .input(startRunSchema)
  .handler(({ input }) => startProcessRun(input.processId, input.overrides));

export const cancel = os
  .input(runIdSchema)
  .handler(({ input }) => cancelRun(input.runId));

export const getRun = os
  .input(runIdSchema)
  .handler(({ input }) => dbGetRun(input.runId));

export const listByProcess = os
  .input(
    z.object({
      processId: z.number().int().positive(),
      limit: z.number().int().positive().optional(),
    })
  )
  .handler(({ input }) =>
    dbListRunsByProcess(input.processId, input.limit ?? 100)
  );

export const listRecent = os
  .input(z.object({ limit: z.number().int().positive().optional() }).optional())
  .handler(({ input }) => dbListRecentRuns(input?.limit ?? 25));

export const getLogs = os
  .input(
    z.object({
      runId: z.number().int().positive(),
      afterId: z.number().int().nonnegative().optional(),
    })
  )
  .handler(({ input }) => dbGetLogs(input.runId, input.afterId ?? 0));
