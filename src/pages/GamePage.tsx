import { useCallback, useEffect } from "react";

import { HangmanDrawing } from "@/components/HangmanDrawing";
import { HeaderMenu } from "@/components/headerMenu";
import { Powers } from "@/components/powers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { wordPoints } from "@/lib/utils";
import { useGameStore, useUserStore } from "@/store/gameStore";
import type { PowerTypes } from "@/types/game-types";

export function GamePage() {
  const { category, difficulty, round, setRound } = useGameStore();
  const { score, lives, setScore, streak, setStreak } = useUserStore();

  const { word, hint, guessedLetters } = round;
  console.log("🚀 ~ GamePage ~ guessedLetters:", guessedLetters);

  const powers: PowerTypes[] = [
    {
      name: "Clue",
      description: "Provides a hint for the current word.",
      Icon: () => <span>💡</span>,
      multiUse: false,
      active: true,
    },
    {
      name: "Reveal",
      description: "Reveals a letter in the current word.",
      Icon: () => <span>🔍</span>,
      multiUse: false,
      active: true,
    },
    {
      name: "Shield",
      description: "Protects the player from one incorrect guess.",
      Icon: () => <span>🛡️</span>,
      multiUse: false,
      active: true,
    },
    {
      name: "Skip",
      description: "Skips the current word.",
      Icon: () => <span>⏩</span>,
      multiUse: false,
      active: true,
    },
    {
      name: "Zap",
      description: "Removes five incorrect letters from the current word.",
      Icon: () => <span>⚡</span>,
      multiUse: false,
      active: false,
    },
    {
      name: "Phone a Friend",
      description: "Calls a random AI agent for help with the current word.",
      Icon: () => <span>📞</span>,
      multiUse: false,
      active: true,
    },
  ];

  const kbdKeys = ["qwertyuiop", "asdfghjkl", "zxcvbnm"].map((row) => [...row]);

  const feelingLucky = () => {
    setScore(score - 250);
  };

  const wrongLetter = guessedLetters.filter(
    (letter) => !word.includes(letter),
  ).length;

  const addTypedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || gameLost || gameWon) return;
      setRound({ guessedLetters: [...guessedLetters, letter] });
    },
    [guessedLetters],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (!key.match(/^[a-z]$/)) return;

      e.preventDefault();
      addTypedLetter(key);
    };

    document.addEventListener("keypress", handler);

    return () => {
      document.removeEventListener("keypress", handler);
    };
  });

  const updateStreak = () => {};

  const hardMode = difficulty === "hard" || difficulty === "executioner";
  const gameLost =
    (hardMode && wrongLetter >= 6) || (!hardMode && wrongLetter >= 11);
  const gameWon = [...word].every((letter) => guessedLetters.includes(letter));

  const guess = (letter: string) => {
    if (guessedLetters.includes(letter) || status !== "in-progress") return;

    const next = [...guessedLetters, letter];
    const won = [...word].every((l) => next.includes(l));

    setRound({ guessedLetters: next, status: won ? "won" : "in-progress" });
    if (won) {
      setScore(score + wordPoints(word, difficulty));
      setStreak(streak + 1);
    }
  };

  return (
    <div className="relative z-10 mx-auto w-dvh p-4 text-center">
      <div className="mb-8 flex items-center justify-center gap-8">
        <HeaderMenu />
        <div className="flex flex-col items-center gap-2">
          <div>
            <span>Score</span>
            <span>{score}</span>
          </div>
          <div aria-label={`${lives} lives remaining`}>
            <span>Lives</span>
            {Array.from({ length: lives }, (_, i) => (
              <span key={i}>❤️</span>
            ))}
          </div>
        </div>
        <div>
          <span>{hint}</span>
        </div>
      </div>
      <section className="grid grid-cols-2 gap-14">
        <div>
          <HangmanDrawing wrongGuesses={wrongLetter} difficulty={difficulty} />
        </div>
        <div>
          <h6>{category}</h6>
          <div className="flex items-center justify-center gap-x-3">
            <>
              {[...word].map((char, i) => (
                <div key={i} className="w-6">
                  <span
                    className={`text-lg font-bold uppercase ${guessedLetters.includes(char) || gameLost || gameWon ? "visible" : "invisible"} ${!guessedLetters.includes(char) && gameLost ? "text-red-500" : "text-black"}`}
                  >
                    {char}
                  </span>
                  <hr className="border-b border-black/70" />
                </div>
              ))}
            </>
          </div>
          <span>{`Worth ${wordPoints(word, difficulty)} points`}</span>
        </div>
      </section>
      <section>
        <div className="flex items-center justify-center gap-4">
          <h5>Powers</h5>
          <div>
            {powers.map((power) => (
              <Powers key={power.name} {...power} />
            ))}
          </div>
        </div>
      </section>
      {difficulty !== "hard" && difficulty !== "executioner" && (
        <section>
          <Button onClick={feelingLucky} disabled={score < 250}>
            Feeling Lucky <Badge>250 pts</Badge>
          </Button>
        </section>
      )}
      <section>
        {kbdKeys.map((kdb, i) => (
          <div key={kdb[i]}>
            {kdb.map((char, i) => (
              <Button
                key={i}
                variant="outline"
                className="uppercase"
                onClick={() =>
                  !guessedLetters.includes(char) &&
                  setRound({
                    guessedLetters: [...guessedLetters, char.toUpperCase()],
                  })
                }
                disabled={guessedLetters.includes(char) || gameLost || gameWon}
              >
                {char}
              </Button>
            ))}
          </div>
        ))}
      </section>
      <section>
        <div>
          <span>Streak</span>
          <span>{streak}</span>
        </div>
      </section>
    </div>
  );
}
