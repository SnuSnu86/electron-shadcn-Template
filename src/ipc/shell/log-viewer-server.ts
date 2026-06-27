import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
};

let server: http.Server | null = null;
let activePort: number | null = null;
let activeRoot: string | null = null;

export async function startLogViewerServer(logViewerRoot: string): Promise<number> {
  const resolvedRoot = path.resolve(logViewerRoot);

  if (server && activePort !== null && activeRoot === resolvedRoot) {
    return activePort;
  }

  if (server) {
    await new Promise<void>((resolve) => {
      server?.close(() => resolve());
    });
    server = null;
    activePort = null;
    activeRoot = null;
  }

  activeRoot = resolvedRoot;

  return new Promise((resolve, reject) => {
    server = http.createServer((req, res) => {
      const requestPath = decodeURIComponent((req.url ?? "/").split("?")[0]);
      const relativePath =
        requestPath === "/" ? "APP-LogViewer.html" : requestPath.replace(/^\/+/, "");
      const filePath = path.resolve(resolvedRoot, relativePath);

      if (
        filePath !== resolvedRoot &&
        !filePath.startsWith(`${resolvedRoot}${path.sep}`)
      ) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }

      fs.readFile(filePath, (error, data) => {
        if (error) {
          res.writeHead(404);
          res.end("Not found");
          return;
        }

        const extension = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
          "Content-Type":
            MIME_TYPES[extension] ?? "application/octet-stream",
        });
        res.end(data);
      });
    });

    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server?.address();
      if (!address || typeof address === "string") {
        reject(new Error("Log viewer server could not bind to a port"));
        return;
      }

      activePort = address.port;
      resolve(activePort);
    });
  });
}
