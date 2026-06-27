import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = process.cwd();

function readSource(relativePath: string) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

describe("process management UI", () => {
  it("does not expose process create or edit entry points", () => {
    const catalog = readSource("src/routes/prozesse.index.tsx");
    const detail = readSource("src/routes/prozesse.$processId.tsx");

    expect(catalog).not.toContain("ProcessEditorDialog");
    expect(catalog).not.toContain("Neuer Prozess");
    expect(detail).not.toContain("ProcessEditorDialog");
    expect(detail).not.toContain("Prozess bearbeiten");
    expect(detail).not.toContain("Prozess löschen");
  });

  it("offers documentation downloads as markdown and pdf", () => {
    const detail = readSource("src/routes/prozesse.$processId.tsx");

    expect(detail).toContain("Download Doku als Markdown");
    expect(detail).toContain("Download Doku als PDF");
    expect(detail).toContain('className="w-60"');
    expect(detail).toContain('className="whitespace-nowrap"');
    expect(detail).toContain("exportProcessMarkdown");
    expect(detail).toContain("exportProcessPdf");
    expect(detail).not.toContain("Runbook als Markdown");
  });
});
