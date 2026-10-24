import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { timing, durations, type Stage } from "./state";
export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(query.matches);
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  return reduced;
}
export function useScene(
  stage: Stage,
  running: boolean,
  paused: boolean,
  reduced: boolean,
  advance: () => void,
) {
  const root = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const position = useRef({ stage, time: 0 });
  useLayoutEffect(() => {
    if (!root.current || !running || !(stage in durations)) return;
    if (position.current.stage !== stage) position.current = { stage, time: 0 };
    const context = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: advance });
      timeline.current = tl;
      const beats = [
        ...root.current!.querySelectorAll<HTMLElement>("[data-beat]"),
      ];
      if (stage === "glitch") {
        if (!reduced)
          tl.fromTo(
            ".transition-shutter",
            { scaleY: 0 },
            { scaleY: 1, duration: 0.4, stagger: 0.025, ease: "power3.inOut" },
            0,
          );
      } else {
        beats.forEach((beat, index) => {
          const kind = beat.dataset.kind as keyof typeof timing;
          const spec = timing[kind];
          const start = beats.slice(0, index).reduce((sum, node) => {
            const t = timing[node.dataset.kind as keyof typeof timing];
            return sum + t.enter + t.read + t.exit;
          }, 0);
          const end = start + spec.enter + spec.read;
          tl.set(
            beat,
            {
              visibility: "visible",
              pointerEvents: "auto",
              attr: { "aria-hidden": "false", "data-active": "true" },
            },
            start,
          );
          const words = beat.querySelectorAll(".kinetic-word");
          if (words.length)
            tl.fromTo(
              words,
              { yPercent: reduced ? 0 : 105 },
              {
                yPercent: 0,
                stagger: reduced ? 0 : 0.025,
                duration: reduced ? 0 : 0.28,
                ease: "power3.out",
              },
              start,
            );
          beat
            .querySelectorAll<HTMLElement>(".montage-photo")
            .forEach((photo, i) => {
              tl.fromTo(
                photo,
                {
                  xPercent: reduced ? 0 : [-110, 110, 0][i],
                  yPercent: reduced ? 0 : [12, -15, 110][i],
                  clipPath: reduced ? "inset(0% 0 0 0)" : "inset(10% 0 90% 0)",
                },
                {
                  xPercent: 0,
                  yPercent: 0,
                  clipPath: "inset(0% 0 0 0)",
                  duration: reduced ? 0 : 0.65,
                  ease: "power3.out",
                },
                start + i * 0.12,
              );
            });
          tl.addLabel("read-" + index, start + spec.enter);
          tl.call(
            () => {
              beat.dataset.readable = "true";
            },
            [],
            start + spec.enter,
          );
          if (!reduced)
            tl.to(
              beat,
              {
                opacity: 0,
                y: kind === "photo" ? -16 : 0,
                duration: spec.exit,
                ease: "power2.in",
              },
              end,
            );
          tl.set(
            beat,
            {
              visibility: "hidden",
              pointerEvents: "none",
              attr: { "aria-hidden": "true", "data-active": "false" },
            },
            end + spec.exit,
          );
        });
      }
      tl.to({}, { duration: durations[stage as keyof typeof durations] }, 0);
      if (position.current.time) tl.seek(position.current.time, false);
    }, root);
    return () => {
      position.current = { stage, time: timeline.current?.time() ?? 0 };
      context.revert();
      timeline.current = null;
    };
  }, [stage, running, reduced, advance]);
  useEffect(() => {
    timeline.current?.paused(paused);
  }, [paused, stage, running, reduced]);
  return root;
}
