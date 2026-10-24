import type { ReactNode } from "react";
import type { Memory } from "../../content/types";
import { ChapterImage, PendingMedia } from "./ChapterMedia";

type Props = { memory: Memory; photoIndex: number };
function ChapterLayout({
  memory,
  photoIndex,
  decoration,
}: Props & { decoration?: ReactNode }) {
  const image = memory.photos[photoIndex];
  const next =
    memory.photos.length > 1
      ? memory.photos[(photoIndex + 1) % memory.photos.length]
      : undefined;
  return (
    <div
      className={
        "memory-composition memory-" +
        memory.composition +
        (image ? " has-media" : " text-only")
      }
    >
      <div className="memory-copy">
        <p className="memory-overline">
          {memory.date?.confirmed ? memory.date.label : "Con el profe Danilo"}
        </p>
        <h1 tabIndex={-1}>{memory.title}</h1>
        <p className="memory-description">{memory.description}</p>
      </div>
      <div className="memory-art">
        {decoration}
        {image ? (
          <>
            <ChapterImage
              key={image.src}
              image={{ ...image, fit: image.fit ?? "contain" }}
              className="memory-main-image"
            />
            {next && (
              <ChapterImage
                key={next.src}
                image={{ ...next, fit: next.fit ?? "contain" }}
                className="memory-secondary-image"
              />
            )}
          </>
        ) : (
          <>
            <div className="memory-type-art" aria-hidden="true">
              {
                {
                  construction: "DRAGÓN",
                  blueprint: "ARCA",
                  travel: "BRASIL",
                  workspace: "SISCO\nEDU",
                }[memory.composition]
              }
            </div>
            <PendingMedia label={memory.title} />
          </>
        )}
      </div>
    </div>
  );
}
export function DragonChapter(props: Props) {
  return (
    <ChapterLayout
      {...props}
      decoration={<span className="construction-rule" aria-hidden="true" />}
    />
  );
}
export function RoboticsChapter(props: Props) {
  return (
    <ChapterLayout
      {...props}
      decoration={
        <svg className="robotics-plan" viewBox="0 0 600 500" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 80h120v100h100v200h240M590 40H390v90H290v120h260M20 440h100v-80h130M530 430v-80h60" />
            <circle cx="230" cy="180" r="8" />
            <circle cx="390" cy="130" r="8" />
            <circle cx="120" cy="360" r="8" />
          </g>
        </svg>
      }
    />
  );
}
export function BrazilChapter(props: Props) {
  return <ChapterLayout {...props} />;
}
export function SiscoChapter(props: Props) {
  return (
    <ChapterLayout
      {...props}
      decoration={
        <span className="workspace-bracket" aria-hidden="true">
          [ ]
        </span>
      }
    />
  );
}
export const chapterComponents = {
  construction: DragonChapter,
  blueprint: RoboticsChapter,
  travel: BrazilChapter,
  workspace: SiscoChapter,
};
