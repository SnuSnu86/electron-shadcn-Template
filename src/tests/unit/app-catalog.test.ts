import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = process.cwd();

function readSource(relativePath: string) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

describe("app catalog", () => {
  it("adds Appkatalog to the sidebar below Prozesskatalog", () => {
    const sidebar = readSource("src/components/app-sidebar.tsx");

    expect(sidebar).toContain('to: "/appkatalog"');
    expect(sidebar.indexOf("Prozesskatalog")).toBeLessThan(
      sidebar.indexOf("Appkatalog")
    );
  });

  it("lists Saver PDF Worker as a launchable app tile", () => {
    const route = readSource("src/routes/appkatalog.tsx");

    expect(route).toContain("Saver PDF Worker");
    expect(route).toContain("pdflogo.png");
    expect(route).toContain("launchPortableApp");
  });

  it("lists Machine Log Viewer as a launchable app tile", () => {
    const route = readSource("src/routes/appkatalog.tsx");

    expect(route).toContain("Machine Log Viewer");
    expect(route).toContain('"machine-log-viewer"');
    expect(route).toContain("LogViewerApp.png");
    expect(route).toContain("launchPortableApp");
  });

  it("allows launching the PDF Manipulator portable exe", () => {
    const handlers = readSource("src/ipc/shell/handlers.ts");
    const schemas = readSource("src/ipc/shell/schemas.ts");

    expect(schemas).toContain('"saver-pdf-worker"');
    expect(handlers).toContain("portable-apps");
    expect(handlers).toContain(
      "PDF/PDF-Manipulator/release/win-unpacked/JOZI PDF Manipulator.exe"
    );
    expect(handlers).toContain("spawn");
  });

  it("allows opening the Machine Log Viewer html from portable resources", () => {
    const handlers = readSource("src/ipc/shell/handlers.ts");
    const schemas = readSource("src/ipc/shell/schemas.ts");

    expect(schemas).toContain('"machine-log-viewer"');
    expect(handlers).toContain("LogViewer/LogViewer/APP-LogViewer.html");
    expect(handlers).toContain("startLogViewerServer");
    expect(handlers).toContain("openExternal");
    expect(handlers).toContain("127.0.0.1");
    expect(handlers).toContain("portable-apps");
  });

  it("copies app catalog executables into the portable package resources", () => {
    const buildScript = readSource("build-portable.ps1");

    expect(buildScript).toContain('docs\\Apps');
    expect(buildScript).toContain('resources\\portable-apps');
    expect(buildScript).toContain("Copy-Item");
  });
});
