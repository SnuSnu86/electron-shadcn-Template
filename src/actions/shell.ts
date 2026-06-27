import { ipc } from "@/ipc/manager";

export function openExternalLink(url: string) {
  return ipc.client.shell.openExternalLink({ url });
}

type PortableAppId = "saver-pdf-worker" | "machine-log-viewer";

export function launchPortableApp(appId: PortableAppId) {
  return ipc.client.shell.launchPortableApp({ appId });
}
