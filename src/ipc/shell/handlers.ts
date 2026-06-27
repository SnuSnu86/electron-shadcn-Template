import fs from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import { os } from "@orpc/server";
import { app, shell } from "electron";
import { startLogViewerServer } from "./log-viewer-server";
import {
  launchPortableAppInputSchema,
  openExternalLinkInputSchema,
} from "./schemas";

const PORTABLE_APPS = {
  "saver-pdf-worker": {
    kind: "executable",
    path: "PDF/PDF-Manipulator/release/win-unpacked/JOZI PDF Manipulator.exe",
  },
  "machine-log-viewer": {
    kind: "html",
    path: "LogViewer/LogViewer/APP-LogViewer.html",
  },
} as const;

function resolvePortableAppPath(appId: keyof typeof PORTABLE_APPS) {
  const relativePath = PORTABLE_APPS[appId].path;
  const packagedPath = path.join(
    process.resourcesPath,
    "portable-apps",
    relativePath
  );

  if (fs.existsSync(packagedPath)) {
    return packagedPath;
  }

  return path.join(app.getAppPath(), "docs/Apps", relativePath);
}

export const openExternalLink = os
  .input(openExternalLinkInputSchema)
  .handler(({ input }) => {
    const { url } = input;
    shell.openExternal(url);
  });

export const launchPortableApp = os
  .input(launchPortableAppInputSchema)
  .handler(async ({ input }) => {
    const portableApp = PORTABLE_APPS[input.appId];
    const executablePath = resolvePortableAppPath(input.appId);

    if (portableApp.kind === "html") {
      if (input.appId === "machine-log-viewer") {
        const logViewerRoot = path.dirname(executablePath);
        const port = await startLogViewerServer(logViewerRoot);
        await shell.openExternal(
          `http://127.0.0.1:${port}/APP-LogViewer.html`
        );
        return;
      }

      const errorMessage = await shell.openPath(executablePath);
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      return;
    }

    await new Promise<void>((resolve, reject) => {
      const child = spawn(executablePath, [], {
        cwd: path.dirname(executablePath),
        detached: true,
        stdio: "ignore",
        windowsHide: false,
      });

      child.once("error", reject);
      child.once("spawn", () => {
        child.unref();
        resolve();
      });
    });
  });
