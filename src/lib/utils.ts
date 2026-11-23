import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import words from "@/data/words.json";
import { useGameStore, useUserStore } from "@/store/gameStore";
import type { LevelKey } from "@/types/game-types";

const { setDifficulty, setPage, setUnlockPowers, setRound } =
  useGameStore.getState();

type WordsObjType = {
  word: string;
  hint: string;
};

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
 * Picks a random word whose length fits the level, from one category or all
 * of them when `cat` is "Random". Falls back to any word in the pool when no
 * word fits the length range.
 */
export const getWord = (cat: string, lvl: LevelKey) => {
  // SAFETY: words.json maps each category name to an array of { word, hint } objects
  const lists = words as Record<string, WordsObjType[]>;

  const wordPool =
    cat === "Random" ? Object.values(lists).flat() : (lists[cat] ?? []);

  const [min, max] = wordLengths[lvl];

  const wordLvlSize = wordPool.filter(
    (w) => w.word.length >= min && w.word.length <= max,
  );

  return randomWord(wordLvlSize.length ? wordLvlSize : wordPool);
};

// 10 points per unique letter, multiplied by the level's word score
export const wordPoints = (word: string, level: LevelKey) =>
  Math.round(new Set(word).size * 10 * wordScores[level]);

// A streak above 1 multiplies the word's points
export const roundPoints = (word: string, level: LevelKey, streak: number) =>
  wordPoints(word, level) * Math.max(streak, 1);

export const endGame = () => {
  setDifficulty(null);
  setUnlockPowers(false);
  resetGame();
  setPage("home");
};
