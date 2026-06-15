import { useEffect, useRef, useState } from "react";

/** Zählt beim ersten Rendern von 0 auf den Zielwert hoch. */
export function AnimatedNumber({
  value,
  suffix = "",
  durationMs = 800,
}: {
  value: number;
  suffix?: string;
  durationMs?: number;
}) {
  const [display, setDisplay] = useState(0);
  const animated = useRef(false);

  useEffect(() => {
    if (animated.current) {
      setDisplay(value);
      return;
    }
    animated.current = true;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      // ease-out cubic
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(eased * value));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, durationMs]);

  return (
    <span className="font-display tabular-nums">
      {display.toLocaleString("de-DE")}
      {suffix}
    </span>
  );
}
