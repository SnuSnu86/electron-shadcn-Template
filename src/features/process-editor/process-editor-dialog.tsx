import { useNavigate } from "@tanstack/react-router";
import { SaveIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ipc } from "@/ipc/manager";
import { type ProcessInput, useInvalidateProcessData } from "@/lib/queries";
import {
  ACTION_TYPE_LABELS,
  type ActionType,
  CRITICALITY_LABELS,
  type Criticality,
  type DiagramNodeKind,
  FREQUENCY_LABELS,
  type Frequency,
  PROCESS_STATUS_LABELS,
  type ProcessDetail,
  type ProcessStatus,
} from "@/shared/domain";

/* ---------- Serialisierung: strukturierte Daten <-> zeilenbasierte Editierform ---------- */

const lines = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

const parts = (line: string) => line.split("|").map((p) => p.trim());

interface EditorForm {
  actionType: ActionType;
  benefit: string;
  bodyTemplate: string;
  businessOwner: string;
  category: string;
  command: string;
  criticality: Criticality;
  cwd: string;
  descriptionLong: string;
  descriptionShort: string;
  diagram: string;
  errors: string;
  expectedResults: string;
  filePath: string;
  files: string;
  flows: string;
  frequency: Frequency;
  istProcess: string;
  method: "POST" | "GET";
  name: string;
  notes: string;
  padEnvironmentId: string;
  padFlowName: string;
  padUrl: string;
  padWorkflowId: string;
  prerequisites: string;
  sollProcess: string;
  status: ProcessStatus;
  steps: string;
  systems: string;
  tags: string;
  technicalOwner: string;
  techSystems: string;
  url: string;
  whenToUse: string;
}

const EMPTY_FORM: EditorForm = {
  name: "",
  descriptionShort: "",
  descriptionLong: "",
  businessOwner: "",
  technicalOwner: "",
  category: "Allgemein",
  criticality: "medium",
  frequency: "ondemand",
  status: "active",
  systems: "",
  tags: "",
  istProcess: "",
  sollProcess: "",
  benefit: "",
  flows: "",
  files: "",
  techSystems: "",
  notes: "",
  whenToUse: "",
  prerequisites: "",
  steps: "",
  expectedResults: "",
  errors: "",
  diagram: "start | Start\nsystem | Verarbeitung\nend | Ende",
  actionType: "shell",
  command: "",
  cwd: "",
  url: "",
  method: "POST",
  bodyTemplate: "",
  filePath: "",
  padEnvironmentId: "",
  padFlowName: "",
  padUrl: "",
  padWorkflowId: "",
};

const DIAGRAM_KINDS: DiagramNodeKind[] = [
  "start",
  "input",
  "system",
  "decision",
  "output",
  "end",
];

function detailToForm(detail: ProcessDetail): EditorForm {
  return {
    name: detail.name,
    descriptionShort: detail.descriptionShort,
    descriptionLong: detail.descriptionLong,
    businessOwner: detail.businessOwner,
    technicalOwner: detail.technicalOwner,
    category: detail.category,
    criticality: detail.criticality,
    frequency: detail.frequency,
    status: detail.status,
    systems: detail.systems.join(", "),
    tags: detail.tags.join(", "),
    istProcess: detail.business.istProcess,
    sollProcess: detail.business.sollProcess,
    benefit: detail.business.benefit,
    flows: detail.tech.flows
      .map((f) => [f.name, f.kind, f.link ?? ""].filter(Boolean).join(" | "))
      .join("\n"),
    files: detail.tech.files.map((f) => `${f.path} | ${f.purpose}`).join("\n"),
    techSystems: detail.tech.systems
      .map((s) => [s.name, s.detail ?? ""].filter(Boolean).join(" | "))
      .join("\n"),
    notes: detail.tech.notes ?? "",
    whenToUse: detail.runbook.whenToUse,
    prerequisites: detail.runbook.prerequisites.join("\n"),
    steps: detail.runbook.steps.join("\n"),
    expectedResults: detail.runbook.expectedResults.join("\n"),
    errors: detail.runbook.errors
      .map((e) =>
        [e.problem, e.solution, e.escalation ?? ""].filter(Boolean).join(" | ")
      )
      .join("\n"),
    diagram: detail.diagram.nodes
      .map((n) =>
        [n.kind, n.label, n.sublabel ?? ""].filter(Boolean).join(" | ")
      )
      .join("\n"),
    actionType: detail.action.type,
    command: detail.action.command ?? "",
    cwd: detail.action.cwd ?? "",
    url: detail.action.url ?? "",
    method: detail.action.method ?? "POST",
    bodyTemplate: detail.action.bodyTemplate ?? "",
    filePath: detail.action.filePath ?? "",
    padEnvironmentId: detail.action.padEnvironmentId ?? "",
    padFlowName: detail.action.padFlowName ?? "",
    padUrl: detail.action.padUrl ?? "",
    padWorkflowId: detail.action.padWorkflowId ?? "",
  };
}

function formToInput(form: EditorForm): ProcessInput {
  const nodes = lines(form.diagram).map((line, i) => {
    const [kind, label, sublabel] = parts(line);
    return {
      id: `n${i}`,
      kind: DIAGRAM_KINDS.includes(kind as DiagramNodeKind)
        ? (kind as DiagramNodeKind)
        : "system",
      label: label ?? kind,
      sublabel: sublabel || undefined,
    };
  });
  return {
    name: form.name,
    descriptionShort: form.descriptionShort,
    descriptionLong: form.descriptionLong,
    businessOwner: form.businessOwner,
    technicalOwner: form.technicalOwner,
    category: form.category || "Allgemein",
    criticality: form.criticality,
    frequency: form.frequency,
    status: form.status,
    systems: form.systems
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    tags: form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    business: {
      istProcess: form.istProcess,
      sollProcess: form.sollProcess,
      benefit: form.benefit,
    },
    tech: {
      flows: lines(form.flows).map((line) => {
        const [name, kind, link] = parts(line);
        return {
          name: name ?? line,
          kind: kind ?? "",
          link: link || undefined,
        };
      }),
      files: lines(form.files).map((line) => {
        const [path, purpose] = parts(line);
        return { path: path ?? line, purpose: purpose ?? "" };
      }),
      systems: lines(form.techSystems).map((line) => {
        const [name, detail] = parts(line);
        return { name: name ?? line, detail: detail || undefined };
      }),
      notes: form.notes || undefined,
    },
    runbook: {
      whenToUse: form.whenToUse,
      prerequisites: lines(form.prerequisites),
      steps: lines(form.steps),
      expectedResults: lines(form.expectedResults),
      errors: lines(form.errors).map((line) => {
        const [problem, solution, escalation] = parts(line);
        return {
          problem: problem ?? line,
          solution: solution ?? "",
          escalation: escalation || undefined,
        };
      }),
    },
    diagram: {
      nodes,
      edges: nodes
        .slice(0, -1)
        .map((n, i) => ({ from: n.id, to: nodes[i + 1].id })),
    },
    action: {
      type: form.actionType,
      command: form.command || undefined,
      cwd: form.cwd || undefined,
      url: form.url || undefined,
      method: form.method,
      bodyTemplate: form.bodyTemplate || undefined,
      filePath: form.filePath || undefined,
      padEnvironmentId: form.padEnvironmentId || undefined,
      padFlowName: form.padFlowName || undefined,
      padUrl: form.padUrl || undefined,
      padWorkflowId: form.padWorkflowId || undefined,
    },
  };
}

/* ---------- UI-Bausteine ---------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/20 p-4">
      <legend className="px-1.5 font-display font-semibold text-[0.6875rem] text-primary uppercase tracking-widest">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-[0.625rem] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default function ProcessEditorDialog({
  open,
  onOpenChange,
  processId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  processId: number | null;
}) {
  const [form, setForm] = useState<EditorForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const invalidate = useInvalidateProcessData();
  const navigate = useNavigate();

  useEffect(() => {
    if (open && processId) {
      ipc.client.catalog.getProcess({ id: processId }).then((detail) => {
        if (detail) {
          setForm(detailToForm(detail));
        }
      });
    } else if (open) {
      setForm(EMPTY_FORM);
    }
  }, [open, processId]);

  const set = <K extends keyof EditorForm>(key: K, value: EditorForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setLoading(true);
    try {
      const input = formToInput(form);
      if (processId) {
        await ipc.client.catalog.updateProcess({ id: processId, input });
        invalidate(processId);
        toast.success("Prozess gespeichert");
      } else {
        const newId = await ipc.client.catalog.createProcess(input);
        invalidate();
        toast.success("Prozess angelegt");
        navigate({
          to: "/prozesse/$processId",
          params: { processId: String(newId) },
        });
      }
      onOpenChange(false);
    } catch (error) {
      toast.error("Speichern fehlgeschlagen", {
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-display">
            {processId ? "Prozess bearbeiten" : "Neuen Prozess anlegen"}
          </DialogTitle>
          <DialogDescription>
            Listenfelder: ein Eintrag pro Zeile, Teilwerte mit „|" trennen.
          </DialogDescription>
        </DialogHeader>

        <div className="-mx-1 flex flex-col gap-4 overflow-y-auto px-1 py-1">
          <Section title="Stammdaten">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Prozessname *">
                <Input
                  onChange={(e) => set("name", e.target.value)}
                  value={form.name}
                />
              </Field>
              <Field label="Kategorie">
                <Input
                  onChange={(e) => set("category", e.target.value)}
                  placeholder="z.B. SAP, Web, Excel"
                  value={form.category}
                />
              </Field>
              <Field label="Business Owner">
                <Input
                  onChange={(e) => set("businessOwner", e.target.value)}
                  value={form.businessOwner}
                />
              </Field>
              <Field label="Technischer Owner">
                <Input
                  onChange={(e) => set("technicalOwner", e.target.value)}
                  value={form.technicalOwner}
                />
              </Field>
              <Field label="Kritikalität">
                <Select
                  onValueChange={(v) => set("criticality", v as Criticality)}
                  value={form.criticality}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(CRITICALITY_LABELS) as Criticality[]).map(
                      (c) => (
                        <SelectItem key={c} value={c}>
                          {CRITICALITY_LABELS[c]}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Frequenz">
                <Select
                  onValueChange={(v) => set("frequency", v as Frequency)}
                  value={form.frequency}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(FREQUENCY_LABELS) as Frequency[]).map((f) => (
                      <SelectItem key={f} value={f}>
                        {FREQUENCY_LABELS[f]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Status">
                <Select
                  onValueChange={(v) => set("status", v as ProcessStatus)}
                  value={form.status}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      Object.keys(PROCESS_STATUS_LABELS) as ProcessStatus[]
                    ).map((s) => (
                      <SelectItem key={s} value={s}>
                        {PROCESS_STATUS_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field hint="Komma-getrennt" label="Systeme">
                <Input
                  onChange={(e) => set("systems", e.target.value)}
                  placeholder="SAP ECC, Excel, Outlook"
                  value={form.systems}
                />
              </Field>
            </div>
            <Field label="Kurzbeschreibung">
              <Input
                onChange={(e) => set("descriptionShort", e.target.value)}
                value={form.descriptionShort}
              />
            </Field>
            <Field label="Ausführliche Beschreibung">
              <Textarea
                onChange={(e) => set("descriptionLong", e.target.value)}
                rows={3}
                value={form.descriptionLong}
              />
            </Field>
            <Field hint="Komma-getrennt" label="Tags">
              <Input
                onChange={(e) => set("tags", e.target.value)}
                placeholder="SAP, Logistik, Report"
                value={form.tags}
              />
            </Field>
          </Section>

          <Section title="Business-Sicht">
            <Field label="Ist-Prozess (manuell)">
              <Textarea
                onChange={(e) => set("istProcess", e.target.value)}
                rows={2}
                value={form.istProcess}
              />
            </Field>
            <Field label="Soll-Prozess (automatisiert)">
              <Textarea
                onChange={(e) => set("sollProcess", e.target.value)}
                rows={2}
                value={form.sollProcess}
              />
            </Field>
            <Field label="Nutzen">
              <Textarea
                onChange={(e) => set("benefit", e.target.value)}
                rows={2}
                value={form.benefit}
              />
            </Field>
          </Section>

          <Section title="Technik">
            <Field
              hint="Format: Name | Art | Link (optional)"
              label="Flows & Skripte"
            >
              <Textarea
                onChange={(e) => set("flows", e.target.value)}
                placeholder="WE_Buchung_Main | Power Automate Desktop | ms-powerautomate://console"
                rows={2}
                value={form.flows}
              />
            </Field>
            <Field hint="Format: Pfad | Zweck" label="Dateien">
              <Textarea
                onChange={(e) => set("files", e.target.value)}
                placeholder="\\srv\ordner\datei.xlsx | Eingangsliste"
                rows={2}
                value={form.files}
              />
            </Field>
            <Field hint="Format: Name | Detail (optional)" label="Systeme">
              <Textarea
                onChange={(e) => set("techSystems", e.target.value)}
                placeholder="SAP ECC | Transaktion MIGO"
                rows={2}
                value={form.techSystems}
              />
            </Field>
            <Field label="Besonderheiten">
              <Textarea
                onChange={(e) => set("notes", e.target.value)}
                rows={2}
                value={form.notes}
              />
            </Field>
          </Section>

          <Section title="Runbook">
            <Field label="Wann nutze ich diesen Prozess?">
              <Textarea
                onChange={(e) => set("whenToUse", e.target.value)}
                rows={2}
                value={form.whenToUse}
              />
            </Field>
            <Field hint="Eine Voraussetzung pro Zeile" label="Voraussetzungen">
              <Textarea
                onChange={(e) => set("prerequisites", e.target.value)}
                rows={3}
                value={form.prerequisites}
              />
            </Field>
            <Field hint="Ein Schritt pro Zeile" label="Auszuführende Schritte">
              <Textarea
                onChange={(e) => set("steps", e.target.value)}
                rows={4}
                value={form.steps}
              />
            </Field>
            <Field hint="Ein Ergebnis pro Zeile" label="Erwartete Ergebnisse">
              <Textarea
                onChange={(e) => set("expectedResults", e.target.value)}
                rows={3}
                value={form.expectedResults}
              />
            </Field>
            <Field
              hint="Format: Problem | Lösung | Eskalation (optional)"
              label="Fehler & Workarounds"
            >
              <Textarea
                onChange={(e) => set("errors", e.target.value)}
                rows={3}
                value={form.errors}
              />
            </Field>
          </Section>

          <Section title="Diagramm">
            <Field
              hint={`Ein Knoten pro Zeile. Format: Typ | Beschriftung | Untertitel (optional). Typen: ${DIAGRAM_KINDS.join(", ")}. Kanten werden automatisch verbunden.`}
              label="Ablauf-Knoten"
            >
              <Textarea
                className="font-mono text-xs"
                onChange={(e) => set("diagram", e.target.value)}
                rows={5}
                value={form.diagram}
              />
            </Field>
          </Section>

          <Section title="Startaktion">
            <Field label="Typ">
              <Select
                onValueChange={(v) => set("actionType", v as ActionType)}
                value={form.actionType}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(ACTION_TYPE_LABELS) as ActionType[]).map(
                    (t) => (
                      <SelectItem key={t} value={t}>
                        {ACTION_TYPE_LABELS[t]}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </Field>
            {form.actionType === "shell" && (
              <>
                <Field
                  hint="Parameter-Platzhalter: {{schluessel}}"
                  label="Kommando"
                >
                  <Textarea
                    className="font-mono text-xs"
                    onChange={(e) => set("command", e.target.value)}
                    placeholder='powershell -File "C:\RPA\skript.ps1" -Datum {{datum}}'
                    rows={3}
                    value={form.command}
                  />
                </Field>
                <Field label="Arbeitsverzeichnis (optional)">
                  <Input
                    onChange={(e) => set("cwd", e.target.value)}
                    value={form.cwd}
                  />
                </Field>
              </>
            )}
            {form.actionType === "cloudflow" && (
              <>
                <div className="grid grid-cols-4 gap-3">
                  <Field label="Methode">
                    <Select
                      onValueChange={(v) => set("method", v as "POST" | "GET")}
                      value={form.method}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="GET">GET</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <div className="col-span-3">
                    <Field label="Trigger-URL">
                      <Input
                        className="font-mono text-xs"
                        onChange={(e) => set("url", e.target.value)}
                        value={form.url}
                      />
                    </Field>
                  </div>
                </div>
                <Field
                  hint="JSON mit {{platzhaltern}}"
                  label="Request-Body (optional)"
                >
                  <Textarea
                    className="font-mono text-xs"
                    onChange={(e) => set("bodyTemplate", e.target.value)}
                    rows={2}
                    value={form.bodyTemplate}
                  />
                </Field>
              </>
            )}
            {form.actionType === "file" && (
              <Field label="Dateipfad">
                <Input
                  className="font-mono text-xs"
                  onChange={(e) => set("filePath", e.target.value)}
                  placeholder="\\srv\ordner\mappe.xlsm"
                  value={form.filePath}
                />
              </Field>
            )}
            {form.actionType === "pad" && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Flow-Name">
                  <Input
                    onChange={(e) => set("padFlowName", e.target.value)}
                    value={form.padFlowName}
                  />
                </Field>
                <Field label="Flow-ID / Workflow-ID">
                  <Input
                    className="font-mono text-xs"
                    onChange={(e) => set("padWorkflowId", e.target.value)}
                    placeholder="0fdc73b7-78b9-4b4e-887a-ca73268683a8"
                    value={form.padWorkflowId}
                  />
                </Field>
                <Field label="Environment-ID">
                  <Input
                    className="font-mono text-xs"
                    onChange={(e) => set("padEnvironmentId", e.target.value)}
                    placeholder="f5eaa9d6-cb8e-e5b2-b60a-4aa38e133e46"
                    value={form.padEnvironmentId}
                  />
                </Field>
                <Field
                  hint="Optionaler Fallback. Wenn Environment-ID und Workflow-ID gepflegt sind, baut die App die Run-URL automatisch."
                  label="PAD-URL"
                >
                  <Input
                    className="font-mono text-xs"
                    onChange={(e) => set("padUrl", e.target.value)}
                    value={form.padUrl}
                  />
                </Field>
              </div>
            )}
          </Section>
        </div>

        <DialogFooter className="border-border/60 border-t pt-3">
          <Button onClick={() => onOpenChange(false)} variant="ghost">
            Abbrechen
          </Button>
          <Button disabled={!form.name.trim() || loading} onClick={save}>
            <SaveIcon data-icon="inline-start" />
            {loading ? "Speichere …" : "Speichern"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
