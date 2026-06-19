import {
  GraduationCapIcon,
  PencilIcon,
  PlayIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ipc } from "@/ipc/manager";
import { useInvalidateProcessData, useTutorial } from "@/lib/queries";
import type { ProcessDetail, TutorialStep } from "@/shared/domain";
import { TutorialWizard } from "./tutorial-wizard";

interface StepDraft {
  description: string;
  expectedResult: string;
  group: string;
  id?: number;
  sortOrder?: number;
  title: string;
}

function StepEditorDialog({
  tutorialId,
  processId,
  draft,
  nextOrder,
  onClose,
}: {
  tutorialId: number;
  processId: number;
  draft: StepDraft | null;
  nextOrder: number;
  onClose: () => void;
}) {
  const [form, setForm] = useState<StepDraft>(
    draft ?? { group: "", title: "", description: "", expectedResult: "" }
  );
  const invalidate = useInvalidateProcessData();

  const save = async () => {
    await ipc.client.tutorials.upsertStep({
      id: form.id,
      tutorialId,
      sortOrder: form.sortOrder ?? nextOrder,
      group: form.group,
      title: form.title,
      description: form.description,
      expectedResult: form.expectedResult,
      mediaUrl: null,
    });
    invalidate(processId);
    toast.success(form.id ? "Schritt aktualisiert" : "Schritt hinzugefügt");
    onClose();
  };

  return (
    <Dialog onOpenChange={(open) => !open && onClose()} open>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">
            {form.id ? "Schritt bearbeiten" : "Neuer Tutorial-Schritt"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="s-group">Gruppe (z.B. Vorbereitung)</Label>
              <Input
                id="s-group"
                onChange={(e) => setForm({ ...form, group: e.target.value })}
                value={form.group}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="s-title">Titel</Label>
              <Input
                id="s-title"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                value={form.title}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="s-desc">Beschreibung</Label>
            <Textarea
              id="s-desc"
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={4}
              value={form.description}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="s-result">Erwartetes Ergebnis</Label>
            <Textarea
              id="s-result"
              onChange={(e) =>
                setForm({ ...form, expectedResult: e.target.value })
              }
              rows={2}
              value={form.expectedResult}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="ghost">
            Abbrechen
          </Button>
          <Button disabled={!form.title} onClick={save}>
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function TutorialTab({
  process,
  wizardOpen,
  onWizardOpenChange,
}: {
  process: ProcessDetail;
  wizardOpen: boolean;
  onWizardOpenChange: (open: boolean) => void;
}) {
  const { data: tutorial } = useTutorial(process.id);
  const invalidate = useInvalidateProcessData();
  const [stepDraft, setStepDraft] = useState<StepDraft | null>(null);
  const [stepEditorOpen, setStepEditorOpen] = useState(false);
  const [metaOpen, setMetaOpen] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  const createTutorial = async () => {
    await ipc.client.tutorials.upsertTutorial({
      processId: process.id,
      title: metaTitle || `Anleitung: ${process.name}`,
      description: metaDescription,
    });
    invalidate(process.id);
    setMetaOpen(false);
    toast.success("Tutorial angelegt — füge jetzt Schritte hinzu.");
  };

  const editStep = (step: TutorialStep) => {
    setStepDraft({
      id: step.id,
      sortOrder: step.sortOrder,
      group: step.group,
      title: step.title,
      description: step.description,
      expectedResult: step.expectedResult,
    });
    setStepEditorOpen(true);
  };

  const removeStep = async (step: TutorialStep) => {
    await ipc.client.tutorials.deleteStep({ id: step.id });
    invalidate(process.id);
    toast.success("Schritt gelöscht");
  };

  if (!tutorial) {
    return (
      <div className="animate-fade-in">
        <Card className="py-12">
          <CardContent className="flex flex-col items-center gap-3 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <GraduationCapIcon className="size-5" />
            </span>
            <h3 className="font-display font-semibold">
              Noch kein Tutorial vorhanden
            </h3>
            <p className="max-w-md text-muted-foreground text-sm">
              Ein Tutorial führt neue Kolleginnen und Kollegen Schritt für
              Schritt durch diesen Prozess — inklusive Checkliste und
              Trainings-Nachweis.
            </p>
            <Button className="mt-2" onClick={() => setMetaOpen(true)}>
              <PlusIcon data-icon="inline-start" />
              Tutorial anlegen
            </Button>
          </CardContent>
        </Card>

        <Dialog onOpenChange={setMetaOpen} open={metaOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">
                Tutorial anlegen
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="t-title">Titel</Label>
                <Input
                  id="t-title"
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={`Anleitung: ${process.name}`}
                  value={metaTitle}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="t-desc">Beschreibung</Label>
                <Textarea
                  id="t-desc"
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={3}
                  value={metaDescription}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setMetaOpen(false)} variant="ghost">
                Abbrechen
              </Button>
              <Button onClick={createTutorial}>Anlegen</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  let currentGroup = "";

  return (
    <div className="flex animate-fade-in flex-col gap-4">
      <Card className="gap-0 py-0">
        <div className="flex items-center justify-between gap-4 border-border/60 border-b px-4 py-3">
          <div className="min-w-0">
            <h3 className="truncate font-display font-semibold text-sm">
              {tutorial.title}
            </h3>
            <p className="text-[0.6875rem] text-muted-foreground">
              {tutorial.description || "Keine Beschreibung."} —{" "}
              {tutorial.steps.length} Schritte
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              onClick={() => {
                setStepDraft(null);
                setStepEditorOpen(true);
              }}
              size="sm"
              variant="outline"
            >
              <PlusIcon data-icon="inline-start" />
              Schritt
            </Button>
            <Button
              disabled={tutorial.steps.length === 0}
              onClick={() => onWizardOpenChange(true)}
              size="sm"
            >
              <PlayIcon data-icon="inline-start" />
              Tutorial starten
            </Button>
          </div>
        </div>
        <CardContent className="p-0">
          {tutorial.steps.length === 0 && (
            <p className="px-4 py-10 text-center text-muted-foreground text-sm">
              Noch keine Schritte definiert.
            </p>
          )}
          <ol className="divide-y divide-border/60">
            {tutorial.steps.map((step, i) => {
              const showGroup = step.group && step.group !== currentGroup;
              if (showGroup) {
                currentGroup = step.group;
              }
              return (
                <li key={step.id}>
                  {showGroup && (
                    <p className="bg-muted/40 px-4 py-1.5 font-medium text-[0.625rem] text-muted-foreground uppercase tracking-widest">
                      {step.group}
                    </p>
                  )}
                  <div className="group flex items-start gap-3 px-4 py-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15 font-display font-semibold text-[0.6875rem] text-primary">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[0.8125rem]">
                        {step.title}
                      </p>
                      <p className="mt-0.5 text-muted-foreground text-xs leading-relaxed">
                        {step.description}
                      </p>
                      {step.expectedResult && (
                        <p className="mt-1 text-[0.6875rem] text-success">
                          Erwartet: {step.expectedResult}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        onClick={() => editStep(step)}
                        size="icon-sm"
                        variant="ghost"
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        className="text-destructive"
                        onClick={() => removeStep(step)}
                        size="icon-sm"
                        variant="ghost"
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      {stepEditorOpen && (
        <StepEditorDialog
          draft={stepDraft}
          nextOrder={tutorial.steps.length}
          onClose={() => setStepEditorOpen(false)}
          processId={process.id}
          tutorialId={tutorial.id}
        />
      )}

      {wizardOpen && tutorial.steps.length > 0 && (
        <TutorialWizard
          onClose={() => onWizardOpenChange(false)}
          processName={process.name}
          tutorial={tutorial}
        />
      )}
    </div>
  );
}
