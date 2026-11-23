import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { RoundStatus } from "@/lib/guess";
import type { GamePageProps, LevelKey } from "@/types/game-types";

type MatchTypes = {
  mode: "single" | "multi";
  players: number;
  currentPlayer: number;
  jail: boolean;
  roundNumber: number;
};

type RoundTypes = {
  word: string;
  hint: string;
  guessedLetters: string[];
  status: RoundStatus;
  timeLeft: number | null;
  timerSpeed: number | null;
  revealedSlots: number;
};

type RecordTypes = {
  highScores: number;
  bestStreak: {
    player?: string | number;
    streak: number | null;
  };
};

type GameState = {
  page: GamePageProps;
  difficulty: LevelKey | null;
  category: string | "Random";
  match: MatchTypes;
  round: RoundTypes;
  record: RecordTypes | null;
  unlockPowers?: boolean;
  setPage: (page: GamePageProps) => void;
  setDifficulty: (level: LevelKey | null) => void;
  setCategory: (category: string) => void;
  setMatch: (match: Partial<MatchTypes>) => void;
  setRound: (round: Partial<RoundTypes>) => void;
  setRecord: (record: RecordTypes) => void;
  setUnlockPowers: (powers: boolean) => void;
};

type UserState = {
  score: number;
  lives: number;
  solved: number;
  activePowers: string[];
  streak: number;
  setScore: (score: number) => void;
  setLives: (lives: number) => void;
  setSolved: (solved: number) => void;
  setActivePowers: (powers: string[]) => void;
  releasePower: (power: string) => void;
  setStreak: (streak: number) => void;
};

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      page: "home",
      difficulty: null,
      category: "Random",
      unlockPowers: false,
      match: {
        mode: "single",
        players: 1,
        currentPlayer: 1,
        jail: false,
        roundNumber: 1,
      },
      round: {
        word: "hello",
        hint: "",
        guessedLetters: [],
        wrongGuesses: 0,
        status: "in-progress",
        timeLeft: null,
        timerSpeed: null,
        revealedSlots: 0,
      },
      record: null,
      setPage: (page: GamePageProps) => set({ page }),
      setDifficulty: (level: LevelKey | null) => set({ difficulty: level }),
      setCategory: (category: string) => set({ category }),
      setMatch: (match) => set((s) => ({ match: { ...s.match, ...match } })),
      setRound: (round) => set((s) => ({ round: { ...s.round, ...round } })),
      setRecord: (record: RecordTypes) => set({ record }),
      setUnlockPowers: (unlockPowers) => set({ unlockPowers }),
    }),
    {
      name: "hangman",
      version: 2,
      // v1 stored capitalised levels ("Easy"); drop it rather than migrate
      migrate: () => ({}),
      partialize: (s) => ({
        difficulty: s.difficulty,
        record: s.record,
      }),
    },
  ),
);

export const useUserStore = create<UserState>((set) => ({
  score: 0,
  lives: 3,
  solved: 0,
  activePowers: [],
  streak: 0,
  setActivePowers: (powers: string[]) => set({ activePowers: powers }),
  // Frees one use of a power so its button enables again
  releasePower: (power: string) =>
    set((s) => {
      const index = s.activePowers.indexOf(power);

      return index === -1
        ? s
        : { activePowers: s.activePowers.toSpliced(index, 1) };
    }),
  setScore: (score: number) => set({ score }),
  setLives: (lives: number) => set({ lives }),
  setSolved: (solved: number) => set({ solved }),
  setStreak: (streak: number) => set({ streak }),
}));
