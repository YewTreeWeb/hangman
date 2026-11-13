import type { LevelKey } from "@/types/game-types";

type DrawingProps = {
  difficulty: LevelKey | null;
  wrongGuesses: number;
};

export function HangmanDrawing({ wrongGuesses, difficulty }: DrawingProps) {
  const LEFT_LEG = (
    <span
      data-id="left-arm"
      className="absolute top-52 right-5.5 h-18 w-1.5 rotate-38 self-end bg-black dark:bg-white"
    ></span>
  );
  const RIGHT_LEG = (
    <span
      data-id="right-arm"
      className="absolute top-52 -right-5.5 h-18 w-1.5 -rotate-38 self-end bg-black dark:bg-white"
    ></span>
  );
  const LEFT_ARM = (
    <span
      data-id="left-arm"
      className="absolute top-25 right-5 h-15 w-1.5 -rotate-38 self-end bg-black dark:bg-white"
    ></span>
  );
  const RIGHT_ARM = (
    <span
      data-id="right-arm"
      className="absolute top-25 -right-5 h-15 w-1.5 rotate-38 self-end bg-black dark:bg-white"
    ></span>
  );
  const BODY = (
    <span
      data-id="body"
      className="absolute top-29 right-0 h-25 w-1.5 self-end bg-black dark:bg-white"
    ></span>
  );
  const HEAD = (
    <span
      data-id="head"
      className="absolute top-17.5 -right-5 h-12 w-12 self-end rounded-full border-6 border-black dark:border-white"
    ></span>
  );

  const ROPE = (
    <span
      data-id="rope"
      className="absolute top-0 right-0 h-18 w-2 self-end bg-black dark:bg-white"
    ></span>
  );
  const SUPPORT_BEAM = (
    <span
      data-id="support-beam"
      className="absolute top-10 right-26 h-2.5 w-30 -rotate-40 bg-black dark:bg-white"
    ></span>
  );
  const TOP_BEAM = (
    <span
      data-id="top-beam"
      className="mr-2 inline-flex h-2.5 w-52 self-end bg-black dark:bg-white"
    ></span>
  );
  const POLE = (
    <span
      data-id="pole"
      className="ml-10 h-96 w-2.5 bg-black dark:bg-white"
    ></span>
  );
  const BASE = (
    <span data-id="base" className="h-2.5 w-64 bg-black dark:bg-white"></span>
  );

  const BODY_PARTS = [HEAD, BODY, LEFT_ARM, RIGHT_ARM, LEFT_LEG, RIGHT_LEG];
  const GALLOW_PARTS = [BASE, POLE, TOP_BEAM, SUPPORT_BEAM, ROPE];
  const PARTS = GALLOW_PARTS.concat(BODY_PARTS);

  const hardMode = difficulty === "hard" || difficulty === "executioner";

  return (
    <div className="relative h-101 w-64">
      <div className="flex w-full flex-col-reverse items-start justify-center">
        <>
          {!hardMode
            ? PARTS.slice(0, wrongGuesses)
            : BODY_PARTS.slice(0, wrongGuesses)}
          {hardMode && GALLOW_PARTS}
        </>
      </div>
    </div>
  );
}
