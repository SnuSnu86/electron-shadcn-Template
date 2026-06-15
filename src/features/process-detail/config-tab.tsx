import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ipc } from "@/ipc/manager";
import { useInvalidateProcessData, useParameters } from "@/lib/queries";
import {
  ACTION_TYPE_LABELS,
  PARAM_TYPE_LABELS,
  type ParamType,
  type ProcessDetail,
  type ProcessParameter,
} from "@/shared/domain";

interface ParamDraft {
  defaultValue: string;
  description: string;
  group: string;
  id?: number;
  key: string;
  name: string;
  options: string;
  required: boolean;
  type: ParamType;
}

const EMPTY_DRAFT: ParamDraft = {
  name: "",
  key: "",
  type: "string",
  defaultValue: "",
  required: false,
  group: "Allgemein",
  description: "",
  options: "",
};

function ParameterEditorDialog({
  processId,
  draft,
  onClose,
}: {
  processId: number;
  draft: ParamDraft | null;
  onClose: () => void;
}) {
  const [form, setForm] = useState<ParamDraft>(draft ?? EMPTY_DRAFT);
  const invalidate = useInvalidateProcessData();

  const save = async () => {
    try {
      await ipc.client.catalog.upsertParameter({
        id: form.id,
        processId,
        name: form.name,
        key: form.key,
        type: form.type,
        defaultValue: form.defaultValue,
        required: form.required,
        group: form.group || "Allgemein",
        description: form.description,
        options: form.options
          .split(",")
          .map((o) => o.trim())
          .filter(Boolean),
        sortOrder: 0,
      });
      invalidate(processId);
      toast.success(form.id ? "Parameter aktualisiert" : "Parameter angelegt");
      onClose();
    } catch (error) {
      toast.error("Speichern fehlgeschlagen", {
        description: error instanceof Error ? error.message : String(error),
      });
    }
  };

  return (
    <Dialog onOpenChange={(open) => !open && onClose()} open>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">
            {form.id ? "Parameter bearbeiten" : "Neuer Parameter"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p-name">Name</Label>
            <Input
              id="p-name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              value={form.name}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p-key">Schlüssel (für {"{{platzhalter}}"})</Label>
            <Input
              id="p-key"
              onChange={(e) =>
                setForm({ ...form, key: e.target.value.replace(/\W/g, "_") })
              }
              value={form.key}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Typ</Label>
            <Select
              onValueChange={(v) => setForm({ ...form, type: v as ParamType })}
              value={form.type}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(PARAM_TYPE_LABELS) as ParamType[]).map((t) => (
                  <SelectItem key={t} value={t}>
                    {PARAM_TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p-group">Gruppe</Label>
            <Input
              id="p-group"
              onChange={(e) => setForm({ ...form, group: e.target.value })}
              value={form.group}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p-default">Standardwert</Label>
            <Input
              id="p-default"
              onChange={(e) =>
                setForm({ ...form, defaultValue: e.target.value })
              }
              value={form.defaultValue}
            />
          </div>
          {form.type === "enum" && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="p-options">Optionen (Komma-getrennt)</Label>
              <Input
                id="p-options"
                onChange={(e) => setForm({ ...form, options: e.target.value })}
                value={form.options}
              />
            </div>
          )}
          <div className="col-span-2 flex flex-col gap-1.5">
            <Label htmlFor="p-desc">Beschreibung</Label>
            <Input
              id="p-desc"
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              value={form.description}
            />
          </div>
          <label
            className="col-span-2 flex cursor-pointer items-center gap-2 text-sm"
            htmlFor="p-required"
          >
            <Checkbox
              checked={form.required}
              id="p-required"
              onCheckedChange={(checked) =>
                setForm({ ...form, required: checked === true })
              }
            />
            Pflichtfeld
          </label>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="ghost">
            Abbrechen
          </Button>
          <Button disabled={!(form.name && form.key)} onClick={save}>
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ConfigTab({
  process,
  canEdit,
}: {
  process: ProcessDetail;
  canEdit: boolean;
}) {
  const { data: parameters } = useParameters(process.id);
  const invalidate = useInvalidateProcessData();
  const [editorDraft, setEditorDraft] = useState<ParamDraft | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const openEditor = (param?: ProcessParameter) => {
    setEditorDraft(
      param
        ? {
            id: param.id,
            name: param.name,
            key: param.key,
            type: param.type,
            defaultValue: param.defaultValue,
            required: param.required,
            group: param.group,
            description: param.description,
            options: param.options.join(", "),
          }
        : null
    );
    setEditorOpen(true);
  };

  const remove = async (param: ProcessParameter) => {
    await ipc.client.catalog.deleteParameter({ id: param.id });
    invalidate(process.id);
    toast.success(`Parameter „${param.name}" gelöscht`);
  };

  return (
    <div className="flex animate-fade-in flex-col gap-4">
      <Card className="gap-0 py-0">
        <div className="flex items-center justify-between border-border/60 border-b px-4 py-3">
          <div>
            <h3 className="font-display font-semibold text-sm">
              Konfigurierbare Parameter
            </h3>
            <p className="text-[0.6875rem] text-muted-foreground">
              Standardwerte gelten für jeden Lauf — im Start-Dialog pro Lauf
              überschreibbar.
            </p>
          </div>
          {canEdit && (
            <Button onClick={() => openEditor()} size="sm" variant="outline">
              <PlusIcon data-icon="inline-start" />
              Parameter
            </Button>
          )}
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Schlüssel</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Standardwert</TableHead>
                <TableHead>Gruppe</TableHead>
                <TableHead>Pflicht</TableHead>
                {canEdit && <TableHead className="w-20" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(parameters ?? []).length === 0 && (
                <TableRow>
                  <TableCell
                    className="h-24 text-center text-muted-foreground"
                    colSpan={canEdit ? 7 : 6}
                  >
                    Keine Parameter definiert.
                  </TableCell>
                </TableRow>
              )}
              {parameters?.map((param) => (
                <TableRow key={param.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-[0.8125rem]">
                        {param.name}
                      </span>
                      {param.description && (
                        <span className="text-[0.6875rem] text-muted-foreground">
                          {param.description}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.6875rem]">
                      {`{{${param.key}}}`}
                    </code>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {PARAM_TYPE_LABELS[param.type]}
                  </TableCell>
                  <TableCell className="max-w-48 truncate font-mono text-xs">
                    {param.defaultValue || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{param.group}</Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    {param.required ? (
                      <span className="text-destructive">Ja</span>
                    ) : (
                      <span className="text-muted-foreground">Nein</span>
                    )}
                  </TableCell>
                  {canEdit && (
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          onClick={() => openEditor(param)}
                          size="icon-sm"
                          variant="ghost"
                        >
                          <PencilIcon />
                        </Button>
                        <Button
                          className="text-destructive"
                          onClick={() => remove(param)}
                          size="icon-sm"
                          variant="ghost"
                        >
                          <Trash2Icon />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="gap-3 py-4">
        <CardContent className="flex flex-col gap-2 text-sm">
          <h3 className="font-display font-semibold text-sm">Startaktion</h3>
          <div className="flex items-center gap-2">
            <Badge>{ACTION_TYPE_LABELS[process.action.type]}</Badge>
          </div>
          {process.action.type === "shell" && process.action.command && (
            <pre className="overflow-x-auto rounded-md bg-muted/50 p-3 font-mono text-[0.6875rem] leading-relaxed">
              {process.action.command}
            </pre>
          )}
          {process.action.type === "cloudflow" && (
            <p className="font-mono text-muted-foreground text-xs">
              {process.action.method ?? "POST"} {process.action.url}
            </p>
          )}
          {process.action.type === "file" && (
            <p className="font-mono text-muted-foreground text-xs">
              {process.action.filePath}
            </p>
          )}
          {process.action.type === "pad" && (
            <p className="text-muted-foreground text-xs">
              Flow: {process.action.padFlowName ?? "—"}
            </p>
          )}
          <p className="text-[0.6875rem] text-muted-foreground">
            Platzhalter wie {"{{schluessel}}"} werden beim Start durch
            Parameterwerte ersetzt. Bearbeitung über „Prozess bearbeiten".
          </p>
        </CardContent>
      </Card>

      {editorOpen && (
        <ParameterEditorDialog
          draft={editorDraft}
          onClose={() => setEditorOpen(false)}
          processId={process.id}
        />
      )}
    </div>
  );
}
