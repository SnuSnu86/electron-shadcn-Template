import { createFileRoute } from "@tanstack/react-router";
import {
  DatabaseBackupIcon,
  EyeIcon,
  FileJsonIcon,
  FileTextIcon,
  PencilRulerIcon,
  PlayIcon,
  ShieldIcon,
} from "lucide-react";
import { toast } from "sonner";
import ToggleTheme from "@/components/toggle-theme";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ipc } from "@/ipc/manager";
import { useRole, useSetRole } from "@/lib/queries";
import { ROLE_LABELS, type UserRole } from "@/shared/domain";
import { cn } from "@/utils/tailwind";

const ROLES: {
  role: UserRole;
  icon: typeof EyeIcon;
  description: string;
}[] = [
  {
    role: "viewer",
    icon: EyeIcon,
    description: "Darf Prozesse, Runs, Logs und Tutorials ansehen.",
  },
  {
    role: "operator",
    icon: PlayIcon,
    description: "Wie Viewer — darf zusätzlich Prozesse starten und abbrechen.",
  },
  {
    role: "editor",
    icon: PencilRulerIcon,
    description:
      "Vollzugriff: Prozesse, Parameter, Runbooks und Tutorials bearbeiten.",
  },
];

function SettingsPage() {
  const { data: role } = useRole();
  const setRole = useSetRole();

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
          Rolle, Darstellung, Export und Datensicherung.
        </p>
      </div>

      <Card
        className="animate-fade-up gap-3"
        style={{ animationDelay: "60ms" }}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-sm">
            <ShieldIcon className="size-4 text-primary" />
            Aktive Rolle
          </CardTitle>
          <CardDescription>
            Basis-Schutz gegen unbeabsichtigte Änderungen — lokal gespeichert,
            kein Login erforderlich (v1).
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {ROLES.map((item) => {
            const active = role === item.role;
            return (
              <button
                className={cn(
                  "flex flex-col gap-2 rounded-lg border p-4 text-left transition-all",
                  active
                    ? "glow-primary border-primary/50 bg-primary/10"
                    : "border-border/60 bg-card hover:border-primary/30"
                )}
                key={item.role}
                onClick={async () => {
                  await setRole.mutateAsync(item.role);
                  toast.success(`Rolle gewechselt: ${ROLE_LABELS[item.role]}`);
                }}
                type="button"
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg",
                    active
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <item.icon className="size-4" />
                </span>
                <span className="font-display font-semibold text-sm">
                  {ROLE_LABELS[item.role]}
                </span>
                <span className="text-[0.6875rem] text-muted-foreground leading-relaxed">
                  {item.description}
                </span>
              </button>
            );
          })}
        </CardContent>
      </Card>

      <Card
        className="animate-fade-up gap-3"
        style={{ animationDelay: "120ms" }}
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
        style={{ animationDelay: "180ms" }}
      >
        <CardHeader>
          <CardTitle className="font-display text-sm">Darstellung</CardTitle>
          <CardDescription>
            Der Leitstand ist für den dunklen Modus entworfen — heller Modus ist
            verfügbar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ToggleTheme />
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/einstellungen")({
  component: SettingsPage,
});
