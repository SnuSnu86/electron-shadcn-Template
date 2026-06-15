import {
  cancel,
  getLogs,
  getRun,
  listByProcess,
  listRecent,
  startRun,
} from "./handlers";

export const runs = {
  startRun,
  cancel,
  getRun,
  listByProcess,
  listRecent,
  getLogs,
};
