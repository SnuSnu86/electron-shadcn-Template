import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  type TutorialInlineSegment,
  parseTutorialInline,
} from "./parse-tutorial-text";
import { resolveTutorialHintImage } from "./tutorial-hint-images";
import { TutorialPadFlow } from "./tutorial-pad-flow";

const CODE_BLOCK_SEGMENT = /(```[\s\S]*?```)/g;
const FULL_CODE_BLOCK = /^```(\w*)\r?\n([\s\S]*?)```$/;
const MARKDOWN_H2_HEADING = /^##\s+(.+)$/;

export function TutorialRichText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const parts = text.split(CODE_BLOCK_SEGMENT).filter(Boolean);

  return (
    <div className={className}>
      {parts.map((part, index) => {
        const codeMatch = part.match(FULL_CODE_BLOCK);

        if (codeMatch) {
          const language = codeMatch[1];
          const code = codeMatch[2];

          // PAD-Code oder VBScript → interaktive Flow-Ansicht
          if (language === "pad" || language === "vbs" || isPadCode(code)) {
            return <TutorialPadFlow code={code} key={`${part}-${index}`} />;
          }

          // Normaler Code-Block
          return <TutorialCodeBlock code={code} key={`${part}-${index}`} />;
        }

        return (
          <div className="space-y-3" key={`${part}-${index}`}>
            {renderTutorialTextBlocks(part.trim())}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Heuristik: Ist dies PAD-Code?
 */
function isPadCode(code: string): boolean {
  const padPatterns = [
    /^(SET|IF|ELSE|END|WAIT|CALL)\s/m,
    /^(Text|DateTime|Excel|SAP|Scripting)\./m,
    /=>/,
  ];
  return padPatterns.some((pattern) => pattern.test(code));
}

function renderTutorialTextBlocks(text: string) {
  return text
    .split(/\n\n+/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) {
        return null;
      }

      const lines = trimmed.split("\n").map((line) => line.trim());
      const headingMatch = lines[0].match(MARKDOWN_H2_HEADING);

      if (headingMatch) {
        const rest = lines.slice(1).join("\n").trim();
        return (
          <div className="space-y-2" key={trimmed}>
            <h3 className="text-base font-semibold tracking-tight">
              {headingMatch[1]}
            </h3>
            {rest ? renderTutorialTextBlock(rest) : null}
          </div>
        );
      }

      return renderTutorialTextBlock(trimmed);
    })
    .filter(Boolean);
}

function renderTutorialTextBlock(trimmed: string) {
  const lines = trimmed.split("\n").map((line) => line.trim());
  const listLines = lines.filter((line) => line.startsWith("- "));

  if (listLines.length > 0 && listLines.length === lines.length) {
    return (
      <ul className="list-disc space-y-1.5 pl-5" key={trimmed}>
        {listLines.map((line) => (
          <li className="leading-relaxed" key={line}>
            <TutorialInlineText text={line.slice(2)} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p className="whitespace-pre-wrap leading-relaxed" key={trimmed}>
      <TutorialInlineText text={trimmed} />
    </p>
  );
}

export function TutorialInlineText({ text }: { text: string }) {
  const segments = parseTutorialInline(text);

  if (segments.length === 0) {
    return null;
  }

  return (
    <>
      {segments.map((segment, index) => (
        <TutorialInlineSegment
          key={`${segment.type}-${index}`}
          segment={segment}
        />
      ))}
    </>
  );
}

function TutorialInlineSegment({ segment }: { segment: TutorialInlineSegment }) {
  switch (segment.type) {
    case "text":
      return <span>{segment.value}</span>;
    case "bold":
      return <strong className="font-semibold">{segment.value}</strong>;
    case "code":
      return (
        <code className="rounded bg-muted/80 px-1 py-0.5 font-mono text-[0.875em]">
          {segment.value}
        </code>
      );
    case "hint":
      return (
        <TutorialHint imagePath={segment.imagePath} label={segment.label} />
      );
    default:
      return null;
  }
}

function TutorialHint({
  label,
  imagePath,
}: {
  label: string;
  imagePath: string;
}) {
  const src = resolveTutorialHintImage(imagePath);

  if (!src) {
    return (
      <span className="text-primary underline decoration-primary/60 underline-offset-2">
        {label}
      </span>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className="cursor-help text-primary underline decoration-primary/60 underline-offset-2"
          tabIndex={0}
        >
          {label}
        </span>
      </TooltipTrigger>
      <TooltipContent
        className="max-w-none border border-border bg-popover p-3 text-popover-foreground shadow-xl [&>svg]:hidden"
        side="top"
        sideOffset={8}
      >
        <img
          alt={label}
          className="max-h-[min(70vh,40rem)] max-w-[min(92vw,56rem)] w-auto rounded-sm object-contain"
          src={src}
        />
      </TooltipContent>
    </Tooltip>
  );
}

function TutorialCodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <Button
        aria-label={copied ? "Code kopiert" : "Code kopieren"}
        className="absolute top-2 right-2 z-10 bg-background/80 shadow-sm backdrop-blur-sm"
        onClick={copyCode}
        size="icon"
        title={copied ? "Code kopiert" : "Code kopieren"}
        variant="outline"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
      <pre className="max-h-[30rem] overflow-auto rounded-lg border border-border/70 bg-muted/65 p-4 pr-12 font-mono text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
