// @vitest-environment node

import path from "node:path";
import { afterEach, describe, expect, test, vi } from "vitest";

vi.mock("electron", () => ({
  app: {
    getPath: (name: string) => {
      if (name !== "userData") {
        throw new Error(`Unexpected app path: ${name}`);
      }
      return path.join("C:", "Users", "Test", "AppData", "Roaming", "JOZI");
    },
  },
}));

describe("database path", () => {
  afterEach(async () => {
    delete process.env.JOZI_PORTABLE_DATA_DIR;
    vi.resetModules();
  });

  test("uses the portable data directory when configured", async () => {
    process.env.JOZI_PORTABLE_DATA_DIR = path.join("D:", "Tools", "JOZI", "data");

    const { getDbPath } = await import("@/main/db/database");

    expect(getDbPath()).toBe(
      path.join("D:", "Tools", "JOZI", "data", "jozi-control-center.db")
    );
  });
});
