/** Inline-Bildhinweis: [[Anzeigetext|images/Prozess/Beispiel.png]] */
const TUTORIAL_HINT_PATTERN = /\[\[([^\]|]+)\|([^\]]+)\]\]/;
/** Fettdruck: **Text** */
const TUTORIAL_BOLD_PATTERN = /\*\*([^*]+)\*\*/;
/** Inline-Code: `Text` */
const TUTORIAL_CODE_PATTERN = /`([^`]+)`/;

export type TutorialInlineSegment =
  | { type: "text"; value: string }
  | { type: "hint"; label: string; imagePath: string }
  | { type: "bold"; value: string }
  | { type: "code"; value: string };

export function parseTutorialInline(text: string): TutorialInlineSegment[] {
  const segments: TutorialInlineSegment[] = [];
  let index = 0;

  while (index < text.length) {
    const rest = text.slice(index);
    const hintMatch = rest.match(TUTORIAL_HINT_PATTERN);
    const boldMatch = rest.match(TUTORIAL_BOLD_PATTERN);
    const codeMatch = rest.match(TUTORIAL_CODE_PATTERN);

    if (hintMatch?.index === 0) {
      segments.push({
        type: "hint",
        label: hintMatch[1],
        imagePath: hintMatch[2].trim(),
      });
      index += hintMatch[0].length;
      continue;
    }

    if (boldMatch?.index === 0) {
      segments.push({ type: "bold", value: boldMatch[1] });
      index += boldMatch[0].length;
      continue;
    }

    if (codeMatch?.index === 0) {
      segments.push({ type: "code", value: codeMatch[1] });
      index += codeMatch[0].length;
      continue;
    }

    const nextSpecial = rest.search(/[\[*`]/);
    if (nextSpecial === -1) {
      segments.push({ type: "text", value: rest });
      break;
    }

    if (nextSpecial > 0) {
      segments.push({ type: "text", value: rest.slice(0, nextSpecial) });
      index += nextSpecial;
      continue;
    }

    segments.push({ type: "text", value: rest[0] });
    index += 1;
  }

  return segments;
}

/** @deprecated Verwende parseTutorialInline */
export function parseTutorialHints(text: string): TutorialInlineSegment[] {
  return parseTutorialInline(text);
}

export function stripTutorialHints(text: string): string {
  return text.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$1");
}
