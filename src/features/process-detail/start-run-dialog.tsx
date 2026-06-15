import { PlayIcon, RocketIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useParameters, useStartRun } from "@/lib/queries";
import {
  ACTION_TYPE_LABELS,
  type ProcessDetail,
  type ProcessParameter,
} from "@/shared/domain";

function ParameterField({
  param,
  value,
  onChange,
}: {
  param: ProcessParameter;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = `param-${param.id}`;
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="flex items-baseline gap-1.5" htmlFor={id}>
        {param.name}
        {param.required && <span className="text-destructive">*</span>}
        <span className="font-mono font-normal text-[0.625rem] text-muted-foreground">
          {`{{${param.key}}}`}
        </span>
      </Label>
      {param.type === "boolean" && (
        <label
          className="flex cursor-pointer items-center gap-2 text-sm"
          htmlFor={id}
        >
          <Checkbox
            checked={value === "true"}
            id={id}
            onCheckedChange={(checked) => onChange(checked ? "true" : "false")}
          />
          <span className="text-muted-foreground text-xs">
            {value === "true" ? "Ja" : "Nein"}
          </span>
        </label>
      )}
      {param.type === "enum" && (
        <Select onValueChange={onChange} value={value}>
          <SelectTrigger id={id}>
            <SelectValue placeholder="Auswählen …" />
          </SelectTrigger>
          <SelectContent>
            {param.options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {param.type !== "boolean" && param.type !== "enum" && (
        <Input
          id={id}
          onChange={(e) => onChange(e.target.value)}
          type={param.type === "number" ? "number" : "text"}
          value={value}
        />
      )}
      {param.description && (
        <p className="text-[0.6875rem] text-muted-foreground">
          {param.description}
        </p>
      )}
    </div>
  );
}

export function StartRunDialog({
  process,
  open,
  onOpenChange,
  onStarted,
}: {
  process: ProcessDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStarted: (runId: number) => void;
}) {
  const { data: parameters } = useParameters(process.id);
  const startRun = useStartRun();
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  const groups = useMemo(() => {
    const map = new Map<string, ProcessParameter[]>();
    for (const param of parameters ?? []) {
      const list = map.get(param.group) ?? [];
      list.push(param);
      map.set(param.group, list);
    }
    return [...map.entries()];
  }, [parameters]);

  const currentValue = (param: ProcessParameter) =>
    overrides[param.key] ?? param.defaultValue;

  const missingRequired = (parameters ?? []).filter(
    (p) => p.required && !currentValue(p).trim()
  );

  const handleStart = async () => {
    try {
      const runId = await startRun.mutateAsync({
        processId: process.id,
        overrides,
      });
      onOpenChange(false);
      setOverrides({});
      toast.success("Prozess gestartet", {
        description: `Run #${runId} läuft — Live-Log geöffnet.`,
      });
      onStarted(runId);
    } catch (error) {
      toast.error("Start fehlgeschlagen", {
        description: error instanceof Error ? error.message : String(error),
      });
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <RocketIcon className="size-4 text-primary" />
            Prozess starten
          </DialogTitle>
          <DialogDescription>
            Du startest <strong>{process.name}</strong> über{" "}
            {ACTION_TYPE_LABELS[process.action.type]}. Parameter gelten nur für
            diesen Lauf.
          </DialogDescription>
        </DialogHeader>

        {groups.length > 0 ? (
          <div className="flex flex-col gap-5">
            {groups.map(([group, params]) => (
              <fieldset className="flex flex-col gap-3" key={group}>
                <legend className="mb-1 font-medium text-[0.625rem] text-muted-foreground uppercase tracking-widest">
                  {group}
                </legend>
                {params.map((param) => (
                  <ParameterField
                    key={param.id}
                    onChange={(value) =>
                      setOverrides((prev) => ({ ...prev, [param.key]: value }))
                    }
                    param={param}
                    value={currentValue(param)}
                  />
                ))}
              </fieldset>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            Dieser Prozess hat keine konfigurierbaren Parameter.
          </p>
        )}

        <div className="rounded-md border border-primary/25 bg-primary/8 px-3 py-2.5 text-xs">
          <p className="font-medium text-primary">Zusammenfassung</p>
          <p className="mt-1 text-muted-foreground">
            Prozess „{process.name}" wird{" "}
            {Object.keys(overrides).length > 0
              ? `mit ${Object.keys(overrides).length} angepassten Parametern`
              : "mit Standardwerten"}{" "}
            gestartet.
          </p>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="ghost">
            Abbrechen
          </Button>
          <Button
            disabled={missingRequired.length > 0 || startRun.isPending}
            onClick={handleStart}
          >
            <PlayIcon data-icon="inline-start" />
            {startRun.isPending ? "Starte …" : "Jetzt starten"}
          </Button>
        </DialogFooter>
        {missingRequired.length > 0 && (
          <p className="text-right text-[0.6875rem] text-destructive">
            Pflichtfelder fehlen:{" "}
            {missingRequired.map((p) => p.name).join(", ")}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
