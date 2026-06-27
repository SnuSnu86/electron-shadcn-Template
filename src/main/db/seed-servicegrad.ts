import { createHash } from "node:crypto";
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
  RUECKSTANDSLISTE_PROCESS_NAME,
  rueckstandslisteAction,
  rueckstandslisteInput,
  rueckstandslisteParameters,
  rueckstandslisteTutorial,
} from "./processes/rueckstandsliste";
import { rueckstandslisteTechnicalArtifacts } from "./processes/rueckstandsliste-artifacts";
import {
  createProcess,
  deleteProcess,
  deleteTutorial,
  getSetting,
  getTutorialByProcess,
  listTechnicalArtifacts,
  replaceTechnicalArtifacts,
  setSetting,
  upsertParameter,
  upsertStep,
  upsertTutorial,
} from "./repository";

const SERVICEGRAD_TUTORIAL_FINGERPRINT_KEY =
  "servicegrad.tutorial.seed-fingerprint";
const RUECKSTANDSLISTE_TUTORIAL_FINGERPRINT_KEY =
  "rueckstandsliste.tutorial.seed-fingerprint";
const LEGACY_SERVICEGRAD_TUTORIAL_FINGERPRINTS = new Set([
  "6208431202d4b27cf35735ce8fc010a86c403793acbce38ddaf265efc321250e",
]);

interface TutorialContent {
  description: string;
  steps: readonly {
    group: string;
    title: string;
    description: string;
    expectedResult: string;
  }[];
  title: string;
}

function tutorialFingerprint(tutorial: TutorialContent): string {
  const content = {
    title: tutorial.title,
    description: tutorial.description,
    steps: tutorial.steps.map((step) => ({
      group: step.group,
      title: step.title,
      description: step.description,
      expectedResult: step.expectedResult,
    })),
  };

  return createHash("sha256").update(JSON.stringify(content)).digest("hex");
}

function backfillProcessAction(processId: number, action: object): void {
  const db = getDb();
  const row = db
    .prepare("SELECT action_json FROM processes WHERE id = ?")
    .get(processId) as { action_json: string } | undefined;
  const current = row ? (JSON.parse(row.action_json) as object) : {};
  const next = { ...current, ...action };

  if (JSON.stringify(current) === JSON.stringify(next)) {
    return;
  }

  db.prepare(
    "UPDATE processes SET action_json = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(JSON.stringify(next), processId);
}

/** Entfernt alle Prozesse außer dem echten Prozesskatalog. */
export function purgeMockProcesses(): void {
  const db = getDb();
  const stale = db
    .prepare(
      `SELECT id FROM processes
       WHERE name NOT IN (?, ?)`
    )
    .all(SERVICEGRAD_PROCESS_NAME, RUECKSTANDSLISTE_PROCESS_NAME) as {
    id: number;
  }[];

  for (const { id } of stale) {
    deleteProcess(id);
  }
}

/** Legt den Servicegrad-Prozess an, sofern er noch nicht in der DB existiert. */
export function seedServicegradIfMissing(): void {
  seedProcessIfMissing({
    action: servicegradAction,
    fingerprintKey: SERVICEGRAD_TUTORIAL_FINGERPRINT_KEY,
    input: servicegradInput,
    legacyFingerprints: LEGACY_SERVICEGRAD_TUTORIAL_FINGERPRINTS,
    name: SERVICEGRAD_PROCESS_NAME,
    parameters: servicegradParameters,
    technicalArtifacts: servicegradTechnicalArtifacts,
    tutorial: servicegradTutorial,
  });
}

/** Legt den Rueckstandsliste-Prozess an, sofern er noch nicht in der DB existiert. */
export function seedRueckstandslisteIfMissing(): void {
  seedProcessIfMissing({
    action: rueckstandslisteAction,
    fingerprintKey: RUECKSTANDSLISTE_TUTORIAL_FINGERPRINT_KEY,
    input: rueckstandslisteInput,
    legacyFingerprints: new Set(),
    name: RUECKSTANDSLISTE_PROCESS_NAME,
    parameters: rueckstandslisteParameters,
    technicalArtifacts: rueckstandslisteTechnicalArtifacts,
    tutorial: rueckstandslisteTutorial,
  });
}

function seedProcessIfMissing({
  action,
  fingerprintKey,
  input,
  legacyFingerprints,
  name,
  parameters,
  technicalArtifacts,
  tutorial,
}: {
  action: object;
  fingerprintKey: string;
  input: Parameters<typeof createProcess>[0];
  legacyFingerprints: Set<string>;
  name: string;
  parameters: Omit<Parameters<typeof upsertParameter>[0], "processId">[];
  technicalArtifacts: Parameters<typeof replaceTechnicalArtifacts>[1];
  tutorial: TutorialContent;
}): void {
  const db = getDb();
  const existing = db
    .prepare("SELECT id FROM processes WHERE name = ? LIMIT 1")
    .get(name) as { id: number } | undefined;

  const processId = existing?.id ?? createProcess(input);

  backfillProcessAction(processId, action);

  if (listTechnicalArtifacts(processId).length === 0) {
    replaceTechnicalArtifacts(processId, technicalArtifacts);
  }

  if (existing) {
    syncTutorial(processId, tutorial, fingerprintKey, legacyFingerprints);
    return;
  }

  for (const param of parameters) {
    upsertParameter({ ...param, processId });
  }

  syncTutorial(processId, tutorial, fingerprintKey, legacyFingerprints);
}

function syncTutorial(
  processId: number,
  tutorial: TutorialContent,
  fingerprintKey: string,
  legacyFingerprints: Set<string>
): void {
  const existingTutorial = getTutorialByProcess(processId);
  const currentFingerprint = tutorialFingerprint(tutorial);

  if (existingTutorial) {
    const existingFingerprint = tutorialFingerprint(existingTutorial);
    const seededFingerprint = getSetting(fingerprintKey);
    const isUnchangedSeed = seededFingerprint === existingFingerprint;
    const isKnownLegacySeed =
      seededFingerprint === null && legacyFingerprints.has(existingFingerprint);

    if (!(isUnchangedSeed || isKnownLegacySeed)) {
      return;
    }

    deleteTutorial(existingTutorial.id);
  }

  const tutorialId = upsertTutorial(
    processId,
    tutorial.title,
    tutorial.description
  );

  tutorial.steps.forEach((step, i) => {
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

  setSetting(fingerprintKey, currentFingerprint);
}

/** Mock-Prozesse entfernen und echten Katalog sicherstellen. */
export function bootstrapRealProcesses(): void {
  purgeMockProcesses();
  seedServicegradIfMissing();
  seedRueckstandslisteIfMissing();
}
