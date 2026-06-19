import { getDb } from "./database";
import {
  SERVICEGRAD_PROCESS_NAME,
  servicegradAction,
  servicegradInput,
  servicegradParameters,
  servicegradTutorial,
} from "./processes/servicegrad";
import { servicegradTechnicalArtifacts } from "./processes/servicegrad-artifacts";
import {
  createProcess,
  deleteProcess,
  listTechnicalArtifacts,
  replaceTechnicalArtifacts,
  upsertParameter,
  upsertStep,
  upsertTutorial,
} from "./repository";

function backfillServicegradAction(processId: number): void {
  const db = getDb();
  const row = db
    .prepare("SELECT action_json FROM processes WHERE id = ?")
    .get(processId) as { action_json: string } | undefined;
  const current = row ? (JSON.parse(row.action_json) as object) : {};
  const next = { ...current, ...servicegradAction };

  if (JSON.stringify(current) === JSON.stringify(next)) {
    return;
  }

  db.prepare(
    "UPDATE processes SET action_json = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(JSON.stringify(next), processId);
}

/** Entfernt alle Prozesse außer dem echten Servicegrad-Eintrag. */
export function purgeMockProcesses(): void {
  const db = getDb();
  const stale = db
    .prepare("SELECT id FROM processes WHERE name != ?")
    .all(SERVICEGRAD_PROCESS_NAME) as { id: number }[];

  for (const { id } of stale) {
    deleteProcess(id);
  }
}

/** Legt den Servicegrad-Prozess an, sofern er noch nicht in der DB existiert. */
export function seedServicegradIfMissing(): void {
  const db = getDb();
  const existing = db
    .prepare("SELECT id FROM processes WHERE name = ? LIMIT 1")
    .get(SERVICEGRAD_PROCESS_NAME) as { id: number } | undefined;

  const processId = existing?.id ?? createProcess(servicegradInput);

  backfillServicegradAction(processId);

  if (listTechnicalArtifacts(processId).length === 0) {
    replaceTechnicalArtifacts(processId, servicegradTechnicalArtifacts);
  }

  if (existing) {
    return;
  }

  for (const param of servicegradParameters) {
    upsertParameter({ ...param, processId });
  }

  const tutorialId = upsertTutorial(
    processId,
    servicegradTutorial.title,
    servicegradTutorial.description
  );

  servicegradTutorial.steps.forEach((step, i) => {
    upsertStep({
      tutorialId,
      sortOrder: i,
      group: step.group,
      title: step.title,
      description: step.description,
      expectedResult: step.expectedResult,
      mediaUrl: null,
    });
  });
}

/** Mock-Prozesse entfernen und echten Katalog sicherstellen. */
export function bootstrapRealProcesses(): void {
  purgeMockProcesses();
  seedServicegradIfMissing();
}
