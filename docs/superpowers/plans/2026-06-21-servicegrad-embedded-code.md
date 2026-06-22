# Servicegrad Embedded Tutorial Code Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Servicegrad tutorial contain directly copyable VBA, VBScript, and PAD flow source plus Excel insertion instructions.

**Architecture:** Keep the canonical source code in `docs/Servicegrad/Makros.md` and `docs/Servicegrad/PAD.md`. Import those files as raw text in the seed definition and extract each named Markdown section for the matching tutorial step, avoiding duplicated automation code.

**Tech Stack:** TypeScript, Vite raw-text imports, Vitest.

---

### Task 1: Specify the visible tutorial content

**Files:**
- Modify: `src/tests/unit/servicegrad-tutorial.test.ts`
- Test: `src/tests/unit/servicegrad-tutorial.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
expect(text).toContain("Alt + F11");
expect(text).toContain("Sub DatenkopierenSAP()");
expect(text).toContain("Sub SGrechner()");
expect(text).toContain("If Not IsObject(application) Then");
expect(text).toContain("Excel.RunMacro");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/tests/unit/servicegrad-tutorial.test.ts`

Expected: the new assertions fail because the current tutorial only names patterns.

- [ ] **Step 3: Commit**

```bash
git add src/tests/unit/servicegrad-tutorial.test.ts
git commit -m "test: require embedded automation code in tutorial"
```

### Task 2: Embed canonical code in the matching tutorial steps

**Files:**
- Modify: `src/main/db/processes/servicegrad.ts`
- Modify: `src/tests/unit/servicegrad-tutorial.test.ts`

- [ ] **Step 1: Add raw source imports and a Markdown-section helper**

```ts
import macrosMarkdown from "../../../../docs/Servicegrad/Makros.md?raw";
import padMarkdown from "../../../../docs/Servicegrad/PAD.md?raw";

function section(markdown: string, heading: string): string {
  const marker = `## ${heading}`;
  const start = markdown.indexOf(marker);
  const end = markdown.indexOf("\n## ", start + marker.length);
  return markdown.slice(start, end === -1 ? undefined : end).trim();
}
```

- [ ] **Step 2: Add code and instructions to each affected tutorial step**

```ts
description: `Öffne die XLSM-Datei. Drücke Alt + F11, wähle Einfügen > Modul,
füge den folgenden Code ein und speichere die Arbeitsmappe als .xlsm.

${section(macrosMarkdown, "DatenkopierenSAP")}`,
```

Use the matching macro sections for `NeueBelegnummer`, `SGrechner`, `DatenUebertragung`, and `EMail`; use the `SAP_Process` PAD section for the VBScript step and the `Data_Preperation` section for the PAD macro-run step. Include a concise note to replace local paths and to send the first email only to a test address.

- [ ] **Step 3: Run test to verify it passes**

Run: `npm test -- src/tests/unit/servicegrad-tutorial.test.ts`

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/main/db/processes/servicegrad.ts src/tests/unit/servicegrad-tutorial.test.ts
git commit -m "feat: embed automation source in servicegrad tutorial"
```

### Task 3: Verify integration

**Files:**
- Verify: `src/main/db/processes/servicegrad.ts`
- Verify: `src/tests/unit/servicegrad-tutorial.test.ts`

- [ ] **Step 1: Run the full unit suite**

Run: `npm test -- src/tests/unit`

Expected: PASS with no failed tests.

- [ ] **Step 2: Run static checks**

Run: `npm run check`

Expected: exit code 0.
