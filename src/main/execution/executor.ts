import { type ChildProcess, spawn } from "node:child_process";
import os from "node:os";
import { shell } from "electron";
import {
  addLog,
  createRun,
  finishRun,
  getProcess,
  listParameters,
} from "@/main/db/repository";
import type { ProcessAction } from "@/shared/domain";

/** Aktive Kindprozesse je Run-ID, um Abbrüche zu ermöglichen. */
const runningChildren = new Map<number, ChildProcess>();

function substitute(template: string, params: Record<string, string>): string {
  return template.replace(
    /\{\{(\w+)\}\}/g,
    (_, key: string) => params[key] ?? ""
  );
}

function resolveParameters(
  processId: number,
  overrides: Record<string, string>
): Record<string, string> {
  const resolved: Record<string, string> = {};
  for (const param of listParameters(processId)) {
    resolved[param.key] = overrides[param.key] ?? param.defaultValue;
  }
  return { ...resolved, ...overrides };
}

const LINE_BREAKS = /\r?\n/;

function logLines(
  runId: number,
  chunk: Buffer | string,
  level: "info" | "error"
) {
  const text = chunk.toString();
  for (const line of text.split(LINE_BREAKS)) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }
    // PowerShell schreibt Warnungen/Fehler oft mit Präfix auf stdout
    const lower = trimmed.toLowerCase();
    let effective: "info" | "warn" | "error" = level;
    if (lower.includes("warnung") || lower.startsWith("warning")) {
      effective = "warn";
    }
    addLog(runId, effective, trimmed, "script");
  }
}

function executeShell(
  runId: number,
  action: ProcessAction,
  params: Record<string, string>
) {
  const command = substitute(action.command ?? "", params);
  if (!command.trim()) {
    addLog(runId, "error", "Kein Kommando konfiguriert.", "app");
    finishRun(runId, "failed", "Kein Kommando konfiguriert");
    return;
  }
  addLog(runId, "info", `Starte Kommando: ${command.slice(0, 200)}`, "app");

  const child = spawn(command, {
    shell: true,
    cwd: action.cwd || undefined,
    windowsHide: true,
  });
  runningChildren.set(runId, child);

  child.stdout?.on("data", (chunk) => logLines(runId, chunk, "info"));
  child.stderr?.on("data", (chunk) => logLines(runId, chunk, "error"));

  child.on("error", (err) => {
    runningChildren.delete(runId);
    addLog(
      runId,
      "error",
      `Prozessstart fehlgeschlagen: ${err.message}`,
      "app"
    );
    finishRun(runId, "failed", err.message);
  });

  child.on("close", (code, signal) => {
    if (!runningChildren.has(runId)) {
      return; // bereits durch cancel/error abgeschlossen
    }
    runningChildren.delete(runId);
    if (signal) {
      addLog(runId, "warn", `Prozess durch Signal ${signal} beendet.`, "app");
      finishRun(runId, "canceled", `Signal ${signal}`);
    } else if (code === 0) {
      addLog(
        runId,
        "info",
        "Prozess erfolgreich abgeschlossen (Exit-Code 0).",
        "app"
      );
      finishRun(runId, "success");
    } else {
      addLog(runId, "error", `Prozess mit Exit-Code ${code} beendet.`, "app");
      finishRun(runId, "failed", `Exit-Code ${code}`);
    }
  });
}

async function executeCloudFlow(
  runId: number,
  action: ProcessAction,
  params: Record<string, string>
) {
  const url = substitute(action.url ?? "", params);
  if (!url) {
    addLog(runId, "error", "Keine Trigger-URL konfiguriert.", "app");
    finishRun(runId, "failed", "Keine Trigger-URL konfiguriert");
    return;
  }
  const method = action.method ?? "POST";
  const body = action.bodyTemplate
    ? substitute(action.bodyTemplate, params)
    : undefined;

  addLog(runId, "info", `HTTP ${method} ${url}`, "app");
  if (body) {
    addLog(runId, "info", `Request-Body: ${body}`, "app");
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);
    const response = await fetch(url, {
      method,
      headers: action.headers,
      body: method === "GET" ? undefined : body,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const text = await response.text().catch(() => "");
    if (response.ok) {
      addLog(
        runId,
        "info",
        `Cloud-Flow erfolgreich getriggert (HTTP ${response.status}).`,
        "external"
      );
      if (text) {
        addLog(runId, "info", `Antwort: ${text.slice(0, 500)}`, "external");
      }
      addLog(
        runId,
        "info",
        "Hinweis: Der Cloud-Flow läuft asynchron weiter — Ergebnis im Flow-Portal prüfen.",
        "app"
      );
      finishRun(runId, "success");
    } else {
      addLog(
        runId,
        "error",
        `Trigger fehlgeschlagen: HTTP ${response.status} ${response.statusText}`,
        "external"
      );
      if (text) {
        addLog(runId, "error", `Antwort: ${text.slice(0, 500)}`, "external");
      }
      finishRun(runId, "failed", `HTTP ${response.status}`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    addLog(runId, "error", `HTTP-Request fehlgeschlagen: ${message}`, "app");
    finishRun(runId, "failed", message);
  }
}

async function executeFile(runId: number, action: ProcessAction) {
  const filePath = action.filePath ?? "";
  if (!filePath) {
    addLog(runId, "error", "Kein Dateipfad konfiguriert.", "app");
    finishRun(runId, "failed", "Kein Dateipfad konfiguriert");
    return;
  }
  addLog(runId, "info", `Öffne Datei: ${filePath}`, "app");
  const errorMessage = await shell.openPath(filePath);
  if (errorMessage) {
    addLog(
      runId,
      "error",
      `Datei konnte nicht geöffnet werden: ${errorMessage}`,
      "app"
    );
    finishRun(runId, "failed", errorMessage);
  } else {
    addLog(
      runId,
      "info",
      "Datei geöffnet. Auto-Makros laufen in der Zielanwendung — Fortschritt dort prüfen.",
      "app"
    );
    finishRun(runId, "success");
  }
}

async function executePad(runId: number, action: ProcessAction) {
  const url = action.padUrl || "ms-powerautomate:";
  addLog(
    runId,
    "info",
    `Starte Power Automate Desktop${action.padFlowName ? ` — Flow: ${action.padFlowName}` : ""}`,
    "app"
  );
  try {
    await shell.openExternal(url);
    addLog(
      runId,
      "info",
      "PAD-Konsole aufgerufen. Flow-Ausführung in der PAD-Konsole verfolgen.",
      "external"
    );
    finishRun(runId, "success");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    addLog(runId, "error", `PAD-Start fehlgeschlagen: ${message}`, "app");
    finishRun(runId, "failed", message);
  }
}

export function startProcessRun(
  processId: number,
  overrides: Record<string, string>
): number {
  const process_ = getProcess(processId);
  if (!process_) {
    throw new Error(`Prozess ${processId} nicht gefunden`);
  }

  const params = resolveParameters(processId, overrides);
  const executedBy = os.userInfo().username;
  const runId = createRun(processId, executedBy, params);

  addLog(
    runId,
    "info",
    `Run für "${process_.name}" gestartet (Benutzer: ${executedBy}).`,
    "app"
  );
  const paramSummary = Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join(", ");
  if (paramSummary) {
    addLog(runId, "info", `Parameter: ${paramSummary}`, "app");
  }

  const failUnexpected = (err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    addLog(runId, "error", `Unerwarteter Fehler: ${message}`, "app");
    finishRun(runId, "failed", message);
  };

  const action = process_.action;
  switch (action.type) {
    case "shell":
      executeShell(runId, action, params);
      break;
    case "cloudflow":
      executeCloudFlow(runId, action, params).catch(failUnexpected);
      break;
    case "file":
      executeFile(runId, action).catch(failUnexpected);
      break;
    case "pad":
      executePad(runId, action).catch(failUnexpected);
      break;
    default:
      addLog(runId, "error", `Unbekannter Aktionstyp: ${action.type}`, "app");
      finishRun(runId, "failed", "Unbekannter Aktionstyp");
  }

  return runId;
}

export function cancelRun(runId: number): boolean {
  const child = runningChildren.get(runId);
  if (!child || child.pid === undefined) {
    return false;
  }
  runningChildren.delete(runId);
  addLog(runId, "warn", "Abbruch durch Benutzer angefordert.", "app");

  if (process.platform === "win32") {
    // Gesamten Prozessbaum beenden (shell:true erzeugt cmd.exe als Elternprozess)
    spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
      windowsHide: true,
    });
  } else {
    child.kill("SIGTERM");
  }

  finishRun(runId, "canceled", "Durch Benutzer abgebrochen");
  return true;
}
