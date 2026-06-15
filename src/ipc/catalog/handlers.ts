import { os } from "@orpc/server";
import {
  createProcess as dbCreateProcess,
  deleteParameter as dbDeleteParameter,
  deleteProcess as dbDeleteProcess,
  getProcess as dbGetProcess,
  listCategories as dbListCategories,
  listParameters as dbListParameters,
  listProcesses as dbListProcesses,
  listTags as dbListTags,
  listTechnicalArtifacts as dbListTechnicalArtifacts,
  replaceTechnicalArtifacts as dbReplaceTechnicalArtifacts,
  toggleFavorite as dbToggleFavorite,
  updateProcess as dbUpdateProcess,
  upsertParameter as dbUpsertParameter,
} from "@/main/db/repository";
import {
  idSchema,
  parameterInputSchema,
  processFilterSchema,
  processInputSchema,
  technicalArtifactInputSchema,
  updateProcessSchema,
} from "./schemas";

export const listProcesses = os
  .input(processFilterSchema.optional())
  .handler(({ input }) => dbListProcesses(input ?? {}));

export const getProcess = os
  .input(idSchema)
  .handler(({ input }) => dbGetProcess(input.id));

export const createProcess = os
  .input(processInputSchema)
  .handler(({ input }) => dbCreateProcess(input));

export const updateProcess = os
  .input(updateProcessSchema)
  .handler(({ input }) => dbUpdateProcess(input.id, input.input));

export const deleteProcess = os
  .input(idSchema)
  .handler(({ input }) => dbDeleteProcess(input.id));

export const toggleFavorite = os
  .input(idSchema)
  .handler(({ input }) => dbToggleFavorite(input.id));

export const listCategories = os.handler(() => dbListCategories());

export const listTags = os.handler(() => dbListTags());

export const listParameters = os
  .input(idSchema)
  .handler(({ input }) => dbListParameters(input.id));

export const upsertParameter = os
  .input(parameterInputSchema)
  .handler(({ input }) => {
    const { id, ...rest } = input;
    return dbUpsertParameter(rest, id);
  });

export const deleteParameter = os
  .input(idSchema)
  .handler(({ input }) => dbDeleteParameter(input.id));

export const listTechnicalArtifacts = os
  .input(idSchema)
  .handler(({ input }) => dbListTechnicalArtifacts(input.id));

export const replaceTechnicalArtifacts = os
  .input(technicalArtifactInputSchema)
  .handler(({ input }) =>
    dbReplaceTechnicalArtifacts(input.processId, input.artifacts)
  );
