import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Powers } from "@/components/powers";
import { Button } from "@/components/ui/button";
import { KEYBOARD_ROWS, type RoundStatus } from "@/lib/guess";
import { cn } from "@/lib/utils";
import type { PowerTypes } from "@/types/game-types";

export type ShieldKind = "none" | "shield" | "super";

const livesColour = {
  none: "text-red-400",
  shield: "text-blue-400",
  super: "text-teal-400",
};

// First heart glows after a red potion and turns green while poisoned
const heartColour = (extraLife: boolean, poisoned: boolean) => {
  if (extraLife)
    return "text-yellow-400! drop-shadow-[0_0_0.25rem_var(--color-yellow-300)] dark:text-yellow-300!";

  return poisoned ? "text-green-700! dark:text-green-600!" : "";
};

type StatsProps = {
  score: number;
  streak: number;
  lives: number;
  shield: ShieldKind;
  extraLife: boolean;
  poisoned: boolean;
};

export function Stats({
  score,
  streak,
  lives,
  shield,
  extraLife,
  poisoned,
}: StatsProps) {
  return (
    <div className="flex w-full flex-row items-center justify-between gap-2">
      <div className="flex items-center justify-start gap-6">
        <div className="flex flex-col gap-1 text-sm">
          <span>Score</span>
          <span className="text-lg font-bold">{score}</span>
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <span>Streak</span>
          <span
            className={cn(
              "text-lg font-bold",
              shield === "super" ? "text-teal-400" : "text-black",
            )}
          >
            {streak}
          </span>
        </div>
      </div>
      <div
        className="flex flex-col gap-1 text-sm"
        aria-label={`${lives} lives remaining`}
      >
        <span>Lives</span>
        <div className={cn("flex gap-x-2", livesColour[shield])}>
          {Array.from({ length: lives }, (_, i) => (
            <span key={i}>
              <FontAwesomeIcon
                icon={faHeart}
                size="lg"
                className={i === 0 ? heartColour(extraLife, poisoned) : ""}
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

type WordDisplayProps = {
  word: string;
  guessedLetters: string[];
  status: RoundStatus;
};

export function WordDisplay({
  word,
  guessedLetters,
  status,
}: WordDisplayProps) {
  return (
    <div className="flex items-center justify-center gap-x-3">
      {[...word].map((char, i) => {
        const guessed = guessedLetters.includes(char);
        const missed = !guessed && status === "lost";

        return (
          <div key={i} className="w-6" data-testid="letter-slot">
            <span
              className={cn(
                "text-4xl font-bold uppercase",
                guessed || status !== "in-progress" ? "visible" : "invisible",
                missed ? "text-red-500" : "text-black",
              )}
            >
              {char}
            </span>
            <hr
              className={cn(
                "border-b",
                missed ? "border-red-500/70" : "border-black/70",
              )}
            />
          </div>
        );
      })}
    </div>
  );
}

type KeyboardProps = {
  guessedLetters: string[];
  zapped: string[];
  disabled: boolean;
  onGuess: (letter: string) => void;
};

// Zapped letters are hidden so they can't be guessed
export function Keyboard({
  guessedLetters,
  zapped,
  disabled,
  onGuess,
}: KeyboardProps) {
  return (
    <section className="flex flex-col items-center justify-center gap-1">
      {KEYBOARD_ROWS.map((row) => (
        <div key={row} className="flex items-center justify-center gap-1">
          {[...row].map((char) => (
            <Button
              key={char}
              variant="outline"
              className={cn(
                "text-black uppercase",
                zapped.includes(char) && "hidden",
              )}
              onClick={() => onGuess(char)}
              disabled={
                disabled ||
                guessedLetters.includes(char) ||
                zapped.includes(char)
              }
            >
              {char}
            </Button>
          ))}
        </div>
      ))}
    </section>
  );
}

type PowerBarProps = {
  powers: PowerTypes[];
  specialPowers: PowerTypes[];
  wonPowers: Record<string, number>;
  hideClue: boolean;
  onUseSpecial: (power: PowerTypes) => void;
};

// Normal powers, then each special power the player currently holds
export function PowerBar({
  powers,
  specialPowers,
  wonPowers,
  hideClue,
  onUseSpecial,
}: PowerBarProps) {
  const ownedSpecialPowers = specialPowers.filter(
    (power) => (wonPowers[power.name] ?? 0) > 0,
  );

  return (
    <section>
      <div className="flex flex-col gap-4">
        <h5 className="text-left text-xs uppercase">Powers</h5>
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-5">
          {powers.map((power) => (
            <Powers
              key={power.name}
              {...power}
              className={hideClue && power.name === "Clue" ? "hidden" : ""}
            />
          ))}
          {ownedSpecialPowers.map((power) => (
            <Powers
              key={power.name}
              {...power}
              multiUse={(wonPowers[power.name] ?? 0) > 1}
              uses={wonPowers[power.name]}
              onUse={() => onUseSpecial(power)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
