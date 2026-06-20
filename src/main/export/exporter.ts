import fs from "node:fs";
import path from "node:path";
import { type BrowserWindow, dialog } from "electron";
import { getDbPath } from "@/main/db/database";
import {
  buildFullExport,
  getProcess,
  getTutorialByProcess,
  listParameters,
  listProcesses,
} from "@/main/db/repository";
import {
  ACTION_TYPE_LABELS,
  FREQUENCY_LABELS,
  PROCESS_STATUS_LABELS,
  type ProcessDetail,
  type ProcessParameter,
  type Tutorial,
} from "@/shared/domain";

function mdEscapePipes(text: string): string {
  return text.replace(/\|/g, "\\|");
}

export function renderProcessMarkdown(
  detail: ProcessDetail,
  parameters: ProcessParameter[],
  tutorial: Tutorial | null
): string {
  const lines: string[] = [];
  const rb = detail.runbook;

  lines.push(`# ${detail.name}`);
  lines.push("");
  lines.push(`> ${detail.descriptionShort}`);
  lines.push("");
  lines.push("## Stammdaten");
  lines.push("");
  lines.push("| Feld | Wert |");
  lines.push("| --- | --- |");
  lines.push(`| Kategorie | ${detail.category} |`);
  lines.push(`| Frequenz | ${FREQUENCY_LABELS[detail.frequency]} |`);
  lines.push(`| Status | ${PROCESS_STATUS_LABELS[detail.status]} |`);
  lines.push(`| Business Owner | ${detail.businessOwner} |`);
  lines.push(`| Technischer Owner | ${detail.technicalOwner} |`);
  lines.push(`| Systeme | ${detail.systems.join(", ")} |`);
  lines.push(`| Tags | ${detail.tags.join(", ")} |`);
  lines.push(`| Startaktion | ${ACTION_TYPE_LABELS[detail.action.type]} |`);
  lines.push("");

  if (detail.descriptionLong) {
    lines.push("## Beschreibung");
    lines.push("");
    lines.push(detail.descriptionLong);
    lines.push("");
  }

  lines.push("## Business-Sicht");
  lines.push("");
  lines.push(`**Ist-Prozess (manuell):** ${detail.business.istProcess}`);
  lines.push("");
  lines.push(
    `**Soll-Prozess (automatisiert):** ${detail.business.sollProcess}`
  );
  lines.push("");
  lines.push(`**Nutzen:** ${detail.business.benefit}`);
  lines.push("");

  lines.push("## Technische Sicht");
  lines.push("");
  if (detail.tech.flows.length > 0) {
    lines.push("### Flows & Skripte");
    lines.push("");
    for (const flow of detail.tech.flows) {
      lines.push(
        `- **${flow.name}** (${flow.kind})${flow.link ? ` — ${flow.link}` : ""}`
      );
    }
    lines.push("");
  }
  if (detail.tech.files.length > 0) {
    lines.push("### Dateien");
    lines.push("");
    lines.push("| Pfad | Zweck |");
    lines.push("| --- | --- |");
    for (const file of detail.tech.files) {
      lines.push(
        `| \`${mdEscapePipes(file.path)}\` | ${mdEscapePipes(file.purpose)} |`
      );
    }
    lines.push("");
  }
  if (detail.tech.systems.length > 0) {
    lines.push("### Systeme");
    lines.push("");
    for (const system of detail.tech.systems) {
      lines.push(
        `- **${system.name}**${system.detail ? ` — ${system.detail}` : ""}`
      );
    }
    lines.push("");
  }
  if (detail.tech.notes) {
    lines.push(`**Besonderheiten:** ${detail.tech.notes}`);
    lines.push("");
  }

  lines.push("## Runbook");
  lines.push("");
  lines.push("### Wann nutze ich diesen Prozess?");
  lines.push("");
  lines.push(rb.whenToUse || "_Nicht dokumentiert._");
  lines.push("");
  lines.push("### Voraussetzungen");
  lines.push("");
  for (const p of rb.prerequisites) {
    lines.push(`- [ ] ${p}`);
  }
  lines.push("");
  lines.push("### Auszuführende Schritte");
  lines.push("");
  for (const [i, s] of rb.steps.entries()) {
    lines.push(`${i + 1}. ${s}`);
  }
  lines.push("");
  lines.push("### Erwartete Ergebnisse");
  lines.push("");
  for (const r of rb.expectedResults) {
    lines.push(`- ${r}`);
  }
  lines.push("");
  lines.push("### Fehler & Workarounds");
  lines.push("");
  for (const e of rb.errors) {
    lines.push(`**Problem:** ${e.problem}`);
    lines.push("");
    lines.push(`**Lösung:** ${e.solution}`);
    if (e.escalation) {
      lines.push("");
      lines.push(`**Eskalation:** ${e.escalation}`);
    }
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  if (parameters.length > 0) {
    lines.push("## Parameter");
    lines.push("");
    lines.push(
      "| Name | Schlüssel | Typ | Standard | Pflicht | Gruppe | Beschreibung |"
    );
    lines.push("| --- | --- | --- | --- | --- | --- | --- |");
    for (const p of parameters) {
      lines.push(
        `| ${p.name} | \`${p.key}\` | ${p.type} | ${mdEscapePipes(p.defaultValue)} | ${p.required ? "Ja" : "Nein"} | ${p.group} | ${mdEscapePipes(p.description)} |`
      );
    }
    lines.push("");
  }

  if (tutorial && tutorial.steps.length > 0) {
    lines.push("## Tutorial");
    lines.push("");
    lines.push(`**${tutorial.title}** — ${tutorial.description}`);
    lines.push("");
    let currentGroup = "";
    tutorial.steps.forEach((step, i) => {
      if (step.group && step.group !== currentGroup) {
        currentGroup = step.group;
        lines.push(`### ${currentGroup}`);
        lines.push("");
      }
      lines.push(`${i + 1}. **${step.title}** — ${step.description}`);
      if (step.expectedResult) {
        lines.push(`   - _Erwartet:_ ${step.expectedResult}`);
      }
    });
    lines.push("");
  }

  lines.push("---");
  lines.push("");
  lines.push(
    `_Exportiert aus JOZI Control & Documentation Center am ${new Date().toLocaleString("de-DE")}_`
  );
  lines.push("");
  return lines.join("\n");
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9äöüÄÖÜß\- ]/g, "_").slice(0, 80);
}

export async function exportAllJson(
  window: BrowserWindow
): Promise<string | null> {
  const result = await dialog.showSaveDialog(window, {
    title: "Vollständigen Export speichern",
    defaultPath: `jozi-export-${new Date().toISOString().slice(0, 10)}.json`,
    filters: [{ name: "JSON", extensions: ["json"] }],
  });
  if (result.canceled || !result.filePath) {
    return null;
  }
  fs.writeFileSync(
    result.filePath,
    JSON.stringify(buildFullExport(), null, 2),
    "utf8"
  );
  return result.filePath;
}

export async function exportMarkdown(
  window: BrowserWindow,
  processId?: number
): Promise<string | null> {
  if (processId) {
    const detail = getProcess(processId);
    if (!detail) {
      throw new Error("Prozess nicht gefunden");
    }
    const result = await dialog.showSaveDialog(window, {
      title: "Runbook als Markdown exportieren",
      defaultPath: `Runbook ${sanitizeFileName(detail.name)}.md`,
      filters: [{ name: "Markdown", extensions: ["md"] }],
    });
    if (result.canceled || !result.filePath) {
      return null;
    }
    const md = renderProcessMarkdown(
      detail,
      listParameters(processId),
      getTutorialByProcess(processId)
    );
    fs.writeFileSync(result.filePath, md, "utf8");
    return result.filePath;
  }

  const result = await dialog.showOpenDialog(window, {
    title: "Zielordner für Markdown-Export wählen",
    properties: ["openDirectory", "createDirectory"],
  });
  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }
  const dir = result.filePaths[0];
  for (const summary of listProcesses()) {
    const detail = getProcess(summary.id);
    if (!detail) {
      continue;
    }
    const md = renderProcessMarkdown(
      detail,
      listParameters(summary.id),
      getTutorialByProcess(summary.id)
    );
    fs.writeFileSync(
      path.join(dir, `Runbook ${sanitizeFileName(detail.name)}.md`),
      md,
      "utf8"
    );
  }
  return dir;
}

export async function backupDatabase(
  window: BrowserWindow
): Promise<string | null> {
  const result = await dialog.showSaveDialog(window, {
    title: "Datenbank-Backup speichern",
    defaultPath: `jozi-backup-${new Date().toISOString().slice(0, 10)}.db`,
    filters: [{ name: "SQLite-Datenbank", extensions: ["db"] }],
  });
  if (result.canceled || !result.filePath) {
    return null;
  }
  fs.copyFileSync(getDbPath(), result.filePath);
  return result.filePath;
}
