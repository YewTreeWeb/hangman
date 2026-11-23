import type { LevelKey } from "@/types/game-types";

export const kbdKeys = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

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

// Random letters not in the word and not yet guessed, for the Zap powers
export const pickZapped = (word: string, guessed: string[], amount: number) =>
  [...kbdKeys.join("")]
    .filter((l) => !word.includes(l) && !guessed.includes(l))
    .sort(() => Math.random() - 0.5)
    .slice(0, amount);
