import type { LevelKey } from "@/types/game-types";

export type RoundStatus = "in-progress" | "won" | "lost";

export const maxWrongGuesses = (difficulty: LevelKey) =>
  difficulty === "hard" || difficulty === "executioner" ? 6 : 11;

export const wrongGuesses = (word: string, guessed: string[]) =>
  guessed.filter((letter) => !word.includes(letter)).length;

export const roundStatus = (
  word: string,
  guessed: string[],
  difficulty: LevelKey,
): RoundStatus => {
  if ([...word].every((letter) => guessed.includes(letter))) return "won";

  return wrongGuesses(word, guessed) >= maxWrongGuesses(difficulty)
    ? "lost"
    : "in-progress";
};
