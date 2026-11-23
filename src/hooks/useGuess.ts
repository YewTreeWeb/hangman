import { useEffect, useEffectEvent } from "react";

import { roundStatus } from "@/lib/guess";
import { settleLoss, settleWin } from "@/lib/utils";
import { useGameStore } from "@/store/gameStore";
import type { LevelKey, Shields } from "@/types/game-types";

/**
 * Guessing for the current round: on-screen and physical keyboard input,
 * and the score, streak, lives and round count when a round ends.
 */
export function useGuess(
  difficulty: LevelKey,
  zapped: string[],
  shields: Shields,
) {
  const { round, setRound, match, setMatch } = useGameStore();

  const { word, guessedLetters, status } = round;

  const canGuess = (letter: string) =>
    status === "in-progress" &&
    !guessedLetters.includes(letter) &&
    !zapped.includes(letter);

  const guessedLetter = (letter: string) => {
    if (!canGuess(letter)) return;

    const next = [...guessedLetters, letter];
    const outcome = roundStatus(word, next, difficulty);

    setRound({ guessedLetters: next, status: outcome });

    if (outcome === "in-progress") return;

    setMatch({ roundNumber: match.roundNumber + 1 });

    if (outcome === "won") {
      settleWin();

      return;
    }

    settleLoss(shields);
  };

  const onKeyPress = useEffectEvent((e: KeyboardEvent) => {
    if (!/^[a-z]$/.test(e.key)) return;

    e.preventDefault();
    guessedLetter(e.key);
  });

  useEffect(() => {
    document.addEventListener("keypress", onKeyPress);

    return () => document.removeEventListener("keypress", onKeyPress);
  }, []);

  return { guessedLetter };
}
