import fs from "node:fs";
import path from "node:path";
import {
  BrowserWindow,
  dialog,
  type BrowserWindow as ElectronBrowserWindow,
} from "electron";
import { getDbPath } from "@/main/db/database";
import {
  buildFullExport,
  getProcess,
  getTutorialByProcess,
  listParameters,
  listProcesses,
} from "@/main/db/repository";
import {
  renderProcessMarkdown,
  renderProcessPdfHtml,
} from "@/main/export/document-renderer";

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9äöüÄÖÜß\- ]/g, "_").slice(0, 80);
}

export async function exportAllJson(
  window: ElectronBrowserWindow
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
  window: ElectronBrowserWindow,
  processId?: number
): Promise<string | null> {
  if (processId) {
    const detail = getProcess(processId);
    if (!detail) {
      throw new Error("Prozess nicht gefunden");
    }
    const result = await dialog.showSaveDialog(window, {
      title: "Dokumentation als Markdown exportieren",
      defaultPath: `Doku ${sanitizeFileName(detail.name)}.md`,
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
      path.join(dir, `Doku ${sanitizeFileName(detail.name)}.md`),
      md,
      "utf8"
    );
  }
  return dir;
}

async function writePdf(
  parentWindow: ElectronBrowserWindow,
  filePath: string,
  html: string
) {
  const pdfWindow = new BrowserWindow({
    parent: parentWindow,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  try {
    await pdfWindow.loadURL(
      `data:text/html;charset=utf-8,${encodeURIComponent(html)}`
    );
    const pdf = await pdfWindow.webContents.printToPDF({
      printBackground: true,
      pageSize: "A4",
      margins: {
        marginType: "custom",
        top: 0.7,
        bottom: 0.7,
        left: 0.7,
        right: 0.7,
      },
    });
    fs.writeFileSync(filePath, pdf);
  } finally {
    pdfWindow.destroy();
  }
}

export async function exportPdf(
  window: ElectronBrowserWindow,
  processId?: number
): Promise<string | null> {
  if (processId) {
    const detail = getProcess(processId);
    if (!detail) {
      throw new Error("Prozess nicht gefunden");
    }
    const result = await dialog.showSaveDialog(window, {
      title: "Dokumentation als PDF exportieren",
      defaultPath: `Doku ${sanitizeFileName(detail.name)}.pdf`,
      filters: [{ name: "PDF", extensions: ["pdf"] }],
    });
    if (result.canceled || !result.filePath) {
      return null;
    }
    await writePdf(
      window,
      result.filePath,
      renderProcessPdfHtml(
        detail,
        listParameters(processId),
        getTutorialByProcess(processId)
      )
    );
    return result.filePath;
  }

  const result = await dialog.showOpenDialog(window, {
    title: "Zielordner für PDF-Export wählen",
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
    await writePdf(
      window,
      path.join(dir, `Doku ${sanitizeFileName(detail.name)}.pdf`),
      renderProcessPdfHtml(
        detail,
        listParameters(summary.id),
        getTutorialByProcess(summary.id)
      )
    );
  }
  return dir;
}

export async function backupDatabase(
  window: ElectronBrowserWindow
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
