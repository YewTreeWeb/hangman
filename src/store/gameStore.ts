import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  wrongLetters: string[];
  correctLetters: string[];
  wrongGuesses: number;
  status: "in-progress" | "won" | "lost";
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
  match: MatchTypes | null;
  round: RoundTypes;
  record: RecordTypes | null;
  setPage: (page: GamePageProps) => void;
  setDifficulty: (level: LevelKey) => void;
  setCategory: (category: string) => void;
  setMatch: (match: MatchTypes | null) => void;
  setRound: (round: Partial<RoundTypes>) => void;
  setRecord: (record: RecordTypes) => void;
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
  setStreak: (streak: number) => void;
};

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      page: "home",
      difficulty: null,
      category: "Random",
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
        wrongLetters: [],
        correctLetters: [],
        wrongGuesses: 0,
        status: "in-progress",
        timeLeft: null,
        timerSpeed: null,
        revealedSlots: 0,
      },
      record: null,
      setPage: (page: GamePageProps) => set((s) => ({ page })),
      setDifficulty: (level: LevelKey) => set((s) => ({ difficulty: level })),
      setCategory: (category: string) => set((s) => ({ category })),
      setMatch: (match: MatchTypes | null) => set((s) => ({ match })),
      setRound: (round) => set((s) => ({ round: { ...s.round, ...round } })),
      setRecord: (record: RecordTypes) => set((s) => ({ record })),
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
  setActivePowers: (powers: string[]) => set((s) => ({ activePowers: powers })),
  setScore: (score: number) => set((s) => ({ score })),
  setLives: (lives: number) => set((s) => ({ lives })),
  setSolved: (solved: number) => set((s) => ({ solved })),
  setStreak: (streak: number) => set((s) => ({ streak })),
}));
