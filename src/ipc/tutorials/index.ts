import {
  deleteStep,
  deleteTutorial,
  getByProcess,
  upsertStep,
  upsertTutorial,
} from "./handlers";

export const tutorials = {
  getByProcess,
  upsertTutorial,
  upsertStep,
  deleteStep,
  deleteTutorial,
};
