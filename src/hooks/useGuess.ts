import { useEffect, useEffectEvent, useState } from "react";

import { roundStatus } from "@/lib/guess";
import { roundPoints } from "@/lib/utils";
import { useGameStore, useUserStore } from "@/store/gameStore";
import type { LevelKey } from "@/types/game-types";

type Shields = { shield: boolean; superShield: boolean };

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

  const { score, setScore, streak, setStreak, lives, setLives } =
    useUserStore();

  const [earned, setEarned] = useState(0);
  const { word, guessedLetters, status } = round;

  const guess = (letter: string) => {
    if (
      status !== "in-progress" ||
      guessedLetters.includes(letter) ||
      zapped.includes(letter)
    )
      return;

    const next = [...guessedLetters, letter];
    const outcome = roundStatus(word, next, difficulty);

    setRound({ guessedLetters: next, status: outcome });

    if (outcome === "in-progress") return;

    setMatch({ roundNumber: match.roundNumber + 1 });

    if (outcome === "won") {
      const points = roundPoints(word, difficulty, streak);

      setEarned(points);
      setScore(score + points);
      setStreak(streak + 1);

      return;
    }

    if (!shields.superShield) setStreak(0);

    if (lives > 0 && !shields.shield && !shields.superShield) {
      setLives(lives - 1);
    }
  };

  // Wins the round without points, for powers that reveal the word
  const revealWord = () => {
    setRound({
      guessedLetters: [...new Set([...guessedLetters, ...word])],
      status: "won",
    });
    setEarned(0);
  };

  const onKeyPress = useEffectEvent((e: KeyboardEvent) => {
    if (!/^[a-z]$/.test(e.key)) return;

    e.preventDefault();
    guess(e.key);
  });

  useEffect(() => {
    document.addEventListener("keypress", onKeyPress);

    return () => document.removeEventListener("keypress", onKeyPress);
  }, []);

  return { guess, revealWord, earned };
}
