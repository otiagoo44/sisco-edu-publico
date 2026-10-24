export const states = [
  "boot",
  "diagnostic",
  "glitch",
  "montage",
  "invitation",
  "accepted",
  "declined",
] as const;
export type Stage = (typeof states)[number];
export type Action = {
  type: "ADVANCE" | "SKIP" | "ACCEPT" | "DECLINE" | "RECONSIDER" | "REPLAY";
};
export const cinematicStages: Stage[] = [
  "boot",
  "diagnostic",
  "glitch",
  "montage",
];
export const durations = {
  boot: 2.0,
  diagnostic: 2.4,
  glitch: 0.55,
  montage: 5.1,
} as const;

export function stageReducer(stage: Stage, action: Action): Stage {
  switch (action.type) {
    case "ADVANCE":
      return (
        (
          {
            boot: "diagnostic",
            diagnostic: "glitch",
            glitch: "montage",
            montage: "invitation",
          } as Partial<Record<Stage, Stage>>
        )[stage] ?? stage
      );
    case "SKIP":
      return cinematicStages.includes(stage) ? "invitation" : stage;
    case "ACCEPT":
      return stage === "invitation" ? "accepted" : stage;
    case "DECLINE":
      return stage === "invitation" ? "declined" : stage;
    case "RECONSIDER":
      return stage === "declined" ? "invitation" : stage;
    case "REPLAY":
      return "boot";
  }
}
