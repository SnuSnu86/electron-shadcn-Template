import {
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GraduationCapIcon,
  PartyPopperIcon,
  XIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import type { Tutorial } from "@/shared/domain";
import { cn } from "@/utils/tailwind";
import { TutorialInlineText, TutorialRichText } from "./tutorial-rich-text";

interface StepState {
  completedAt: string | null;
  done: boolean;
}

interface TutorialWizardProps {
  onClose: () => void;
  processName: string;
  tutorial: Tutorial;
}

export function TutorialDialog(props: TutorialWizardProps) {
  return (
    <Dialog onOpenChange={(open) => !open && props.onClose()} open>
      <DialogContent
        aria-describedby={undefined}
        className="h-[min(92dvh,56rem)] max-w-[calc(100%-2rem)] gap-0 overflow-hidden p-0 sm:max-w-6xl"
        showCloseButton={false}
      >
        <TutorialWizard {...props} />
      </DialogContent>
    </Dialog>
  );
}

export function TutorialWizard({
  tutorial,
  processName,
  onClose,
}: TutorialWizardProps) {
  const steps = tutorial.steps;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [finished, setFinished] = useState(false);
  const [stepStates, setStepStates] = useState<Record<number, StepState>>({});

  const step = steps[index];
  const state = stepStates[step?.id] ?? { done: false, completedAt: null };
  const doneCount = steps.filter((s) => stepStates[s.id]?.done).length;
  const progress = steps.length > 0 ? (doneCount / steps.length) * 100 : 0;

  const groups = useMemo(() => {
    const seen: string[] = [];
    for (const s of steps) {
      if (s.group && !seen.includes(s.group)) {
        seen.push(s.group);
      }
    }
    return seen;
  }, [steps]);

  const toggleDone = (checked: boolean) => {
    setStepStates((prev) => ({
      ...prev,
      [step.id]: {
        done: checked,
        completedAt: checked ? new Date().toLocaleTimeString("de-DE") : null,
      },
    }));
  };

  const goTo = (nextIndex: number) => {
    setDirection(nextIndex > index ? 1 : -1);
    setIndex(nextIndex);
  };

  return (
    <div className="relative flex h-full min-h-0 animate-fade-in flex-col overflow-hidden bg-background/97 backdrop-blur-sm">
      {/* Kopfzeile */}
      <div className="flex items-center gap-4 border-border/60 border-b px-6 py-4">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <GraduationCapIcon className="size-4.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-[0.6875rem] text-primary uppercase tracking-widest">
            Tutorial — {processName}
          </p>
          <DialogTitle asChild>
            <h2 className="truncate font-display font-semibold text-lg">
              {tutorial.title}
            </h2>
          </DialogTitle>
        </div>
        <div className="flex w-56 flex-col gap-1.5">
          <div className="flex justify-between text-[0.6875rem] text-muted-foreground">
            <span>
              Schritt {Math.min(index + 1, steps.length)} von {steps.length}
            </span>
            <span>{doneCount} erledigt</span>
          </div>
          <Progress className="h-1.5" value={progress} />
        </div>
        <Button onClick={onClose} size="icon" variant="ghost">
          <XIcon />
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Schritt-Navigation */}
        <aside className="w-72 shrink-0 overflow-y-auto border-border/60 border-r p-4">
          {groups.length > 0
            ? groups.map((group) => (
                <div className="mb-4" key={group}>
                  <p className="mb-1.5 px-2 font-medium text-[0.625rem] text-muted-foreground uppercase tracking-widest">
                    {group}
                  </p>
                  {steps
                    .map((s, i) => [s, i] as const)
                    .filter(([s]) => s.group === group)
                    .map(([s, i]) => (
                      <StepNavItem
                        active={i === index && !finished}
                        done={stepStates[s.id]?.done ?? false}
                        key={s.id}
                        number={i + 1}
                        onClick={() => {
                          setFinished(false);
                          goTo(i);
                        }}
                        title={s.title}
                      />
                    ))}
                </div>
              ))
            : steps.map((s, i) => (
                <StepNavItem
                  active={i === index && !finished}
                  done={stepStates[s.id]?.done ?? false}
                  key={s.id}
                  number={i + 1}
                  onClick={() => {
                    setFinished(false);
                    goTo(i);
                  }}
                  title={s.title}
                />
              ))}
        </aside>

        {/* Schritt-Inhalt */}
        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          <AnimatePresence custom={direction} mode="wait">
            {finished ? (
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-1 flex-col items-center justify-center gap-4 p-10 text-center"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0, scale: 0.92 }}
                key="finished"
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                <span className="glow-success flex size-16 items-center justify-center rounded-full bg-success/15 text-success">
                  <PartyPopperIcon className="size-7" />
                </span>
                <h3 className="font-display font-semibold text-2xl">
                  Tutorial abgeschlossen!
                </h3>
                <p className="max-w-md text-muted-foreground text-sm">
                  Du hast {doneCount} von {steps.length} Schritten als erledigt
                  markiert. Die Zeitstempel der Schritte dienen als
                  Trainings-Nachweis.
                </p>
                <div className="mt-2 flex flex-col gap-1 rounded-lg border border-border/60 bg-card p-4 text-left text-xs">
                  {steps.map((s, i) => (
                    <div className="flex items-center gap-3" key={s.id}>
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          stepStates[s.id]?.done
                            ? "bg-success"
                            : "bg-muted-foreground/40"
                        )}
                      />
                      <span className="w-56 truncate">
                        {i + 1}. {s.title}
                      </span>
                      <span className="font-mono text-[0.625rem] text-muted-foreground">
                        {stepStates[s.id]?.completedAt ?? "—"}
                      </span>
                    </div>
                  ))}
                </div>
                <Button className="mt-2" onClick={onClose} size="lg">
                  Tutorial beenden
                </Button>
              </motion.div>
            ) : (
              step && (
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="flex min-h-0 flex-1 flex-col overflow-y-auto p-8"
                  custom={direction}
                  exit={{ opacity: 0, x: direction * -40 }}
                  initial={{ opacity: 0, x: direction * 40 }}
                  key={step.id}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mx-auto w-full max-w-2xl">
                    {step.group && (
                      <p className="font-medium text-[0.6875rem] text-primary uppercase tracking-widest">
                        {step.group}
                      </p>
                    )}
                    <h3 className="mt-1 font-display font-semibold text-2xl tracking-tight">
                      <span className="text-muted-foreground/50">
                        {String(index + 1).padStart(2, "0")}.
                      </span>{" "}
                      {step.title}
                    </h3>
                    <TutorialRichText
                      className="mt-4 space-y-4 text-[0.9375rem] leading-relaxed"
                      text={step.description}
                    />

                    {step.expectedResult && (
                      <div className="mt-6 rounded-lg border border-success/25 bg-success/8 p-4">
                        <p className="mb-1 flex items-center gap-2 font-medium text-success text-xs uppercase tracking-widest">
                          <CheckCircle2Icon className="size-3.5" />
                          Erwartetes Ergebnis
                        </p>
                        <p className="text-sm leading-relaxed">
                          <TutorialInlineText text={step.expectedResult} />
                        </p>
                      </div>
                    )}

                    <label
                      className={cn(
                        "mt-8 flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors",
                        state.done
                          ? "border-success/40 bg-success/10"
                          : "border-border/60 bg-card hover:border-primary/40"
                      )}
                      htmlFor={`step-done-${step.id}`}
                    >
                      <Checkbox
                        checked={state.done}
                        id={`step-done-${step.id}`}
                        onCheckedChange={(checked) =>
                          toggleDone(checked === true)
                        }
                      />
                      <span className="font-medium text-sm">
                        Ich habe diesen Schritt ausgeführt
                      </span>
                      {state.completedAt && (
                        <span className="ml-auto font-mono text-[0.6875rem] text-muted-foreground">
                          {state.completedAt}
                        </span>
                      )}
                    </label>
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>

          {/* Fußzeile */}
          {!finished && (
            <div className="z-10 flex shrink-0 items-center justify-between border-border/60 border-t bg-background/97 px-8 py-4 backdrop-blur-sm">
              <Button
                disabled={index === 0}
                onClick={() => goTo(index - 1)}
                variant="outline"
              >
                <ChevronLeftIcon data-icon="inline-start" />
                Zurück
              </Button>
              <Button onClick={onClose} variant="ghost">
                Abbrechen
              </Button>
              {index < steps.length - 1 ? (
                <Button disabled={!state.done} onClick={() => goTo(index + 1)}>
                  Weiter
                  <ChevronRightIcon data-icon="inline-end" />
                </Button>
              ) : (
                <Button
                  className="bg-success text-success-foreground hover:bg-success/80"
                  disabled={!state.done}
                  onClick={() => setFinished(true)}
                >
                  Abschließen
                  <CheckCircle2Icon data-icon="inline-end" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StepNavItem({
  number,
  title,
  done,
  active,
  onClick,
}: {
  number: number;
  title: string;
  done: boolean;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-[0.8125rem] transition-colors",
        active
          ? "bg-primary/12 text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
      onClick={onClick}
      type="button"
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border font-mono text-[0.625rem]",
          done && "border-success/40 bg-success/15 text-success",
          !done && active && "border-primary/40 text-primary",
          !(done || active) && "border-border"
        )}
      >
        {done ? <CheckCircle2Icon className="size-3" /> : number}
      </span>
      <span className="truncate">{title}</span>
    </button>
  );
}
