import z from "zod";

export const openExternalLinkInputSchema = z.object({
  url: z.url(),
});

export const launchPortableAppInputSchema = z.object({
  appId: z.enum(["saver-pdf-worker", "machine-log-viewer"]),
});
