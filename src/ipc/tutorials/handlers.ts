import { os } from "@orpc/server";
import { z } from "zod";
import {
  deleteStep as dbDeleteStep,
  deleteTutorial as dbDeleteTutorial,
  getTutorialByProcess as dbGetTutorialByProcess,
  upsertStep as dbUpsertStep,
  upsertTutorial as dbUpsertTutorial,
} from "@/main/db/repository";

const idSchema = z.object({ id: z.number().int().positive() });

export const getByProcess = os
  .input(z.object({ processId: z.number().int().positive() }))
  .handler(({ input }) => dbGetTutorialByProcess(input.processId));

export const upsertTutorial = os
  .input(
    z.object({
      processId: z.number().int().positive(),
      title: z.string().min(1),
      description: z.string(),
    })
  )
  .handler(({ input }) =>
    dbUpsertTutorial(input.processId, input.title, input.description)
  );

export const upsertStep = os
  .input(
    z.object({
      id: z.number().int().positive().optional(),
      tutorialId: z.number().int().positive(),
      sortOrder: z.number().int(),
      group: z.string(),
      title: z.string().min(1),
      description: z.string(),
      expectedResult: z.string(),
      mediaUrl: z.string().nullable(),
    })
  )
  .handler(({ input }) => {
    const { id, ...rest } = input;
    return dbUpsertStep(rest, id);
  });

export const deleteStep = os
  .input(idSchema)
  .handler(({ input }) => dbDeleteStep(input.id));

export const deleteTutorial = os
  .input(idSchema)
  .handler(({ input }) => dbDeleteTutorial(input.id));
