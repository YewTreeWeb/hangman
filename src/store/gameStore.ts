import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { GamePageProps, LevelTypes } from "@/types/game-types";

type MatchTypes = {
  mode: "single" | "multi";
  players: number;
  currentPlayer: number;
  jail: boolean;
  roundNumber: number;
};

type RoundTypes = {
  word: string;
  guessedLetters: string[];
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
  difficulty: LevelTypes | null;
  category: string | "Random";
  voice: boolean;
  streak: number;
  match: MatchTypes | null;
  round: RoundTypes;
  record: RecordTypes | null;
  setPage: (page: GamePageProps) => void;
  setDifficulty: (level: LevelTypes) => void;
  setCategory: (category: string) => void;
  setVoice: (voice: boolean) => void;
  setStreak: (streak: number) => void;
  setMatch: (match: MatchTypes | null) => void;
  setRound: (round: RoundTypes) => void;
  setRecord: (record: RecordTypes) => void;
};

type UserState = {
  score: number;
  lives: number;
  solved: number;
  activePowers: string[];
  setScore: (score: number) => void;
  setLives: (lives: number) => void;
  setSolved: (solved: number) => void;
  setActivePowers: (powers: string[]) => void;
};

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      page: "home",
      difficulty: null,
      category: "Random",
      voice: false,
      streak: 0,
      match: {
        mode: "single",
        players: 1,
        currentPlayer: 1,
        jail: false,
        roundNumber: 1,
      },
      round: {
        word: "hello",
        guessedLetters: [],
        wrongGuesses: 0,
        status: "in-progress",
        timeLeft: null,
        timerSpeed: null,
        revealedSlots: 0,
      },
      record: null,
      setPage: (page: GamePageProps) => set((s) => ({ page })),
      setDifficulty: (level: LevelTypes) => set((s) => ({ difficulty: level })),
      setCategory: (category: string) => set((s) => ({ category })),
      setVoice: (voice: boolean) => set((s) => ({ voice })),
      setStreak: (streak: number) => set((s) => ({ streak })),
      setMatch: (match: MatchTypes | null) => set((s) => ({ match })),
      setRound: (round: RoundTypes) => set((s) => ({ round })),
      setRecord: (record: RecordTypes) => set((s) => ({ record })),
    }),
    {
      name: "hangman",
      version: 1,
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
  setActivePowers: (powers: string[]) => set((s) => ({ activePowers: powers })),
  setScore: (score: number) => set((s) => ({ score })),
  setLives: (lives: number) => set((s) => ({ lives })),
  setSolved: (solved: number) => set((s) => ({ solved })),
}));
