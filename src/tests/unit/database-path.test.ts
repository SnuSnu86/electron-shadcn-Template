// @vitest-environment node

import path from "node:path";
import { afterEach, describe, expect, test, vi } from "vitest";

const appPaths = {
  exe: path.join("E:", "JOZI", "portable", "app", "JOZI-Docs.exe"),
  userData: path.join("C:", "Users", "Test", "AppData", "Roaming", "JOZI"),
};

vi.mock("electron", () => ({
  app: {
    getPath: (name: string) => {
      if (name !== "userData" && name !== "exe") {
        throw new Error(`Unexpected app path: ${name}`);
      }
      return appPaths[name as keyof typeof appPaths];
    },
  },
}));

describe("database path", () => {
  afterEach(async () => {
    delete process.env.JOZI_PORTABLE_DATA_DIR;
    appPaths.exe = path.join("E:", "JOZI", "portable", "app", "JOZI-Docs.exe");
    appPaths.userData = path.join("C:", "Users", "Test", "AppData", "Roaming", "JOZI");
    vi.resetModules();
  });

  test("uses the portable data directory when configured", async () => {
    process.env.JOZI_PORTABLE_DATA_DIR = path.join("D:", "Tools", "JOZI", "data");

    const { getDbPath } = await import("@/main/db/database");

    expect(getDbPath()).toBe(
      path.join("D:", "Tools", "JOZI", "data", "jozi-control-center.db")
    );
  });

  test("uses portable data next to the app when launched from a portable folder", async () => {
    appPaths.exe = path.join("D:", "Tools", "JOZI", "portable", "app", "JOZI-Docs.exe");

    const { getDbPath } = await import("@/main/db/database");

    expect(getDbPath()).toBe(
      path.join("D:", "Tools", "JOZI", "portable", "data", "jozi-control-center.db")
    );
  });
});
