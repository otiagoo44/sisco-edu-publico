export const states = [
  "boot",
  "diagnostic",
  "glitch",
  "montage",
  "memories",
  "students",
  "before-question",
  "invitation",
  "accepted",
] as const;
export type Stage = (typeof states)[number];
export type Action = { type: "ADVANCE" | "SKIP" | "ACCEPT" | "REPLAY" };
export const cinematicStages: Stage[] = [
  "boot",
  "diagnostic",
  "glitch",
  "montage",
  "memories",
  "students",
];
// Entrance, completely readable hold, then exit. Never count reading during entry.
export const timing = {
  boot: { enter: 0.4, read: 3.4, exit: 0.2 },
  diagnostic: { enter: 0.4, read: 3.3, exit: 0.15 },
  photo: { enter: 0.9, read: 3.3, exit: 0.2 },
  question: { enter: 0.4, read: 3.2, exit: 0.2 },
};
export const durations = {
  boot: 4,
  diagnostic: 7.7,
  glitch: 0.45,
  montage: 21.4,
} as const;
export const sequenceDuration = Object.values(durations).reduce(
  (a, b) => a + b,
  0,
);
export function stageReducer(stage: Stage, action: Action): Stage {
  switch (action.type) {
    case "ADVANCE":
      return (
        (
          {
            boot: "diagnostic",
            diagnostic: "glitch",
            glitch: "montage",
            montage: "memories",
            memories: "students",
            students: "before-question",
            "before-question": "invitation",
          } as Partial<Record<Stage, Stage>>
        )[stage] ?? stage
      );
    case "SKIP":
      return cinematicStages.includes(stage) ? "invitation" : stage;
    case "ACCEPT":
      return stage === "invitation" ? "accepted" : stage;
    case "REPLAY":
      return "boot";
  }
}
