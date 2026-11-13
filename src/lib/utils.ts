import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import words from "@/data/words.json";
import { useGameStore, useUserStore } from "@/store/gameStore";
import type { LevelKey } from "@/types/game-types";

type WordsObjType = {
  word: string;
  hint: string;
};
const { setRound } = useGameStore.getState();
const { setScore, setLives, setSolved, setStreak, setActivePowers } =
  useUserStore.getState();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const resetGame = () => {
  setScore(0);
  setLives(3);
  setSolved(0);
  setStreak(0);
  setActivePowers([]);
  setRound({
    guessedLetters: [],
    status: "in-progress",
  });
  localStorage.clear();
};

export const levelOptions: Record<
  LevelKey,
  { tries: number; timer: boolean; powers: boolean | number }
> = {
  easy: {
    tries: 14,
    timer: false,
    powers: true,
  },
  medium: {
    tries: 10,
    timer: true,
    powers: 2,
  },
  hard: {
    tries: 8,
    timer: true,
    powers: 1,
  },
  executioner: {
    tries: 5,
    timer: true,
    powers: false,
  },
};

const wordLengths: Record<LevelKey, [number, number]> = {
  easy: [3, 5],
  medium: [6, 7],
  hard: [8, 10],
  executioner: [10, 99],
};

const wordScores: Record<LevelKey, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
  executioner: 4,
};

const randomWord = <T>(w: T[]) => w[Math.floor(Math.random() * w.length)]!;

/**
 * Returns a random word from the selected category and difficulty range.
 *
 * @param cat - The word category, or "Random" to pool all categories.
 * @param lvl - The difficulty level that defines the valid word length range.
 * @returns A word object containing the chosen word and hint.
 */
export const getWord = (cat: string, lvl: LevelKey) => {
  const lists = words as Record<string, WordsObjType[]>;
  const wordPool =
    cat === "Random" ? Object.values(lists).flat() : (lists[cat] ?? []);
  const [min, max] = wordLengths[lvl];
  const wordLvlSize = wordPool.filter(
    (w) => w.word.length >= min && w.word.length <= max,
  );
  return randomWord(wordLvlSize.length ? wordLvlSize : wordPool);
};

/**
 * Calculates the score for a guessed word based on its unique letters and the selected level.
 *
 * @param word - The guessed word to score.
 * @param level - The difficulty level determining the score multiplier. Must not be null.
 * @returns The computed score for the word.
 * @throws {Error} If the level is null.
 */
export const wordPoints = (word: string, level: LevelKey | null) => {
  if (!level) throw new Error("Level must not be null");

  return Math.round(new Set(word).size * 10 * wordScores[level]);
};
