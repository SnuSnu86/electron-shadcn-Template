# Servicegrad Local Tutorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a Servicegrad-specific local setup tutorial and safely update unmodified seeded tutorials in existing SQLite databases.

**Architecture:** `servicegrad.ts` remains the canonical tutorial definition. `seed-servicegrad.ts` derives a deterministic fingerprint from a tutorial's visible content and stores the last seeded fingerprint in the existing `settings` table. On startup the seed is replaced only when the persisted tutorial still matches the stored fingerprint, or when it exactly matches the legacy tutorial fingerprint.

**Tech Stack:** TypeScript, Node `node:crypto`, SQLite (`node:sqlite`), Vitest.

---

### Task 1: Specify the corrected tutorial with a failing content test

**Files:**

- Modify: `src/tests/unit/servicegrad-tutorial.test.ts`
- Modify: `src/main/db/processes/servicegrad.ts:265-445`

- [ ] **Step 1: Replace the tutorial test with fixed-scope assertions**

```ts
expect(servicegradTutorial.title).toContain("Servicegrad");
expect(text).toContain("eigenen Arbeitsordner");
expect(text).toContain("PAD-Flow, VBScript und VBA-Makros");
expect(text).not.toContain("Automatisierungsziel festlegen");
expect(text).not.toContain("deinen eigenen Zielprozess");
expect(text).not.toContain("Berechtigung am RPA-Rechner");
expect(text).not.toContain("deine eigenen Zielbereiche");
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- src/tests/unit/servicegrad-tutorial.test.ts`

Expected: FAIL because the current tutorial asks users to define their own process and references RPA-rechner access.

- [ ] **Step 3: Rewrite the tutorial steps as a local Servicegrad build guide**

Replace the generic target-definition step with a fixed process overview. Replace the RPA-rechner prerequisite with local software, access, and configuration checks. Add a path-configuration step requiring users to select paths and copy them consistently into PAD, VBScript, and VBA. Keep SAP export, XLSM, VBScript, PAD, Cloud scheduling, testing, and documentation, but remove alternatives such as "eigene Prozessdatei" and "eigene Zielbereiche".

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `npm test -- src/tests/unit/servicegrad-tutorial.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the tutorial content change**

```bash
git add src/main/db/processes/servicegrad.ts src/tests/unit/servicegrad-tutorial.test.ts
git commit -m "fix: focus servicegrad tutorial on local setup"
```

### Task 2: Add safe seed-version tracking with tests

**Files:**

- Modify: `src/main/db/seed-servicegrad.ts:1-115`
- Modify: `src/tests/unit/pad-action.test.ts`

- [ ] **Step 1: Add failing seed tests**

Add tests that prove a stale recorded seed is refreshed, a manually changed first tutorial step is preserved, and a legacy tutorial matching the previous full tutorial fingerprint is upgraded. Use the existing temporary SQLite fixture. For the preservation case, update the first step through `upsertStep`, bootstrap again, then assert its description remains unchanged.

- [ ] **Step 2: Run the seed test file to verify it fails**

Run: `npm test -- src/tests/unit/pad-action.test.ts`

Expected: FAIL because `syncServicegradTutorial` only compares title and step count and records no tutorial fingerprint.

- [ ] **Step 3: Implement deterministic fingerprint and migration-aware synchronization**

Add `createHash` from `node:crypto` and use the existing `getSetting` and `setSetting` repository helpers. Implement this exact helper and persist the resulting value under `servicegrad.tutorial.seed-fingerprint`:

```ts
function fingerprintTutorial(tutorial: {
  title: string;
  description: string;
  steps: readonly {
    group: string;
    title: string;
    description: string;
    expectedResult: string;
  }[];
}): string {
  return createHash("sha256")
    .update(JSON.stringify(tutorial))
    .digest("hex");
}
```

Keep the old tutorial fingerprint in `LEGACY_SERVICEGRAD_TUTORIAL_FINGERPRINTS`. Replace a tutorial only when absent, when its fingerprint equals the stored fingerprint, or when no stored value exists and it equals a legacy fingerprint. After writing the current seeded tutorial, store its current fingerprint. Otherwise return without writing.

- [ ] **Step 4: Run the seed tests to verify they pass**

Run: `npm test -- src/tests/unit/pad-action.test.ts`

Expected: PASS, including the PAD-action regression test.

- [ ] **Step 5: Commit the safe synchronization change**

```bash
git add src/main/db/seed-servicegrad.ts src/tests/unit/pad-action.test.ts
git commit -m "fix: preserve customized servicegrad tutorials"
```

### Task 3: Run full verification

**Files:**

- Verify: `src/main/db/processes/servicegrad.ts`
- Verify: `src/main/db/seed-servicegrad.ts`
- Verify: `src/tests/unit/servicegrad-tutorial.test.ts`
- Verify: `src/tests/unit/pad-action.test.ts`

- [ ] **Step 1: Run formatting and static checks**

Run: `npm run check`

Expected: exits 0 with no formatter or lint errors.

- [ ] **Step 2: Run all unit tests**

Run: `npm test`

Expected: all Vitest files pass.

- [ ] **Step 3: Inspect the final diff**

Run: `git diff HEAD~2 --check && git status --short`

Expected: no whitespace errors and no uncommitted implementation files.

