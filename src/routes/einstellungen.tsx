import { createFileRoute } from "@tanstack/react-router";
import {
  DatabaseBackupIcon,
  FileJsonIcon,
  FileTextIcon,
} from "lucide-react";
import { toast } from "sonner";
import ThemeSelector from "@/components/theme-selector";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ipc } from "@/ipc/manager";

function SettingsPage() {
  const exportJson = async () => {
    const file = await ipc.client.workspace.exportJson();
    if (file) {
      toast.success("JSON-Export erstellt", { description: file });
    }
  };

  const exportMarkdown = async () => {
    const dir = await ipc.client.workspace.exportProcessMarkdown({});
    if (dir) {
      toast.success("Markdown-Runbooks exportiert", { description: dir });
    }
  };

  const backup = async () => {
    const file = await ipc.client.workspace.backupDb();
    if (file) {
      toast.success("Datenbank-Backup erstellt", { description: file });
    }
  };

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div className="animate-fade-up">
        <h1 className="font-display font-semibold text-3xl tracking-tight">
          Einstellungen
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Darstellung, Export und Datensicherung.
        </p>
      </div>

      <Card
        className="animate-fade-up gap-3"
        style={{ animationDelay: "60ms" }}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-sm">
            <FileJsonIcon className="size-4 text-info" />
            Export & Backup
          </CardTitle>
          <CardDescription>
            Für Audits, Archivierung und Übergaben — alle Exporte bleiben lokal.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={exportJson} variant="outline">
            <FileJsonIcon data-icon="inline-start" />
            Alle Prozesse als JSON
          </Button>
          <Button onClick={exportMarkdown} variant="outline">
            <FileTextIcon data-icon="inline-start" />
            Runbooks als Markdown
          </Button>
          <Button onClick={backup} variant="outline">
            <DatabaseBackupIcon data-icon="inline-start" />
            Datenbank-Backup
          </Button>
        </CardContent>
      </Card>

      <Card
        className="animate-fade-up gap-3"
        style={{ animationDelay: "120ms" }}
      >
        <CardHeader>
          <CardTitle className="font-display text-sm">Darstellung</CardTitle>
          <CardDescription>
            Standard ist „System“ — die App folgt den OS-Einstellungen. Dunkel
            und hell sind manuell wählbar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeSelector />
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/einstellungen")({
  component: SettingsPage,
});
