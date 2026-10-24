import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { durations, type Stage } from "./state";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(query.matches);
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  return reduced;
}

// One timeline per scene owns both its choreography and its transition.
// Scope + revert keep React StrictMode, replay and skip free of stale callbacks.
export function useScene(
  stage: Stage,
  running: boolean,
  paused: boolean,
  reduced: boolean,
  advance: () => void,
) {
  const root = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  useLayoutEffect(() => {
    if (!root.current || !running || reduced || !(stage in durations)) return;
    const context = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: advance });
      timeline.current = tl;
      const words = root.current!.querySelectorAll(".kinetic-word");
      if (words.length)
        tl.from(
          words,
          {
            yPercent: 105,
            opacity: 0,
            stagger: 0.065,
            duration: 0.55,
            ease: "power3.out",
          },
          0.05,
        );
      const lines = root.current!.querySelectorAll(".terminal-line");
      if (lines.length)
        tl.from(
          lines,
          { opacity: 0, x: -8, stagger: 0.29, duration: 0.25 },
          0.12,
        );
      const progress = root.current!.querySelector(".progress-fill");
      if (progress)
        tl.fromTo(
          progress,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: durations[stage as keyof typeof durations] - 0.25,
            ease: "none",
          },
          0,
        );
      const frames = root.current!.querySelectorAll(".montage-photo");
      if (frames.length) {
        tl.from(
          frames,
          {
            clipPath: "inset(100% 0 0 0)",
            y: 34,
            opacity: 0,
            stagger: 0.22,
            duration: 0.8,
            ease: "power3.out",
          },
          0.05,
        );
        tl.fromTo(
          root.current!.querySelectorAll(".montage-photo img"),
          { scale: 1.09 },
          { scale: 1, duration: 4.4, ease: "power1.out" },
          0.1,
        );
        tl.fromTo(
          root.current!.querySelector(".montage-second"),
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.55 },
          2.5,
        );
      }
      if (stage === "glitch")
        tl.fromTo(
          root.current!,
          { x: -5 },
          { x: 0, duration: 0.4, ease: "steps(3)" },
          0,
        );
      tl.to({}, { duration: durations[stage as keyof typeof durations] }, 0);
    }, root);
    return () => {
      context.revert();
      timeline.current = null;
    };
  }, [stage, running, reduced, advance]);
  useEffect(() => {
    timeline.current?.paused(paused);
  }, [paused, stage, running]);
  return root;
}
