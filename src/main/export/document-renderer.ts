import { stripTutorialHints } from "@/features/tutorial/parse-tutorial-text";
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

function htmlEscape(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Exportiert bewusst die vollständige Prozessdokumentation in einem stabilen Abschnittsaufbau.
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
      lines.push(
        `${i + 1}. **${step.title}** — ${stripTutorialHints(step.description)}`
      );
      if (step.expectedResult) {
        lines.push(
          `   - _Erwartet:_ ${stripTutorialHints(step.expectedResult)}`
        );
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

export function renderProcessPdfHtml(
  detail: ProcessDetail,
  parameters: ProcessParameter[],
  tutorial: Tutorial | null
): string {
  const markdown = renderProcessMarkdown(detail, parameters, tutorial);

  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>${htmlEscape(detail.name)} Dokumentation</title>
  <style>
    @page { margin: 18mm; }
    body {
      color: #111827;
      font-family: "Segoe UI", Arial, sans-serif;
      font-size: 11px;
      line-height: 1.55;
      margin: 0;
    }
    h1 {
      border-bottom: 2px solid #111827;
      font-size: 24px;
      margin: 0 0 12px;
      padding-bottom: 8px;
    }
    .subtitle {
      color: #4b5563;
      font-size: 13px;
      margin-bottom: 20px;
    }
    pre {
      font-family: "Segoe UI", Arial, sans-serif;
      white-space: pre-wrap;
      word-break: break-word;
    }
  </style>
</head>
<body>
  <h1>${htmlEscape(detail.name)}</h1>
  <div class="subtitle">${htmlEscape(detail.descriptionShort)}</div>
  <pre>${htmlEscape(markdown)}</pre>
</body>
</html>`;
}
