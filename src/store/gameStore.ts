import { create } from "zustand";

import type { GamePageProps, LevelTypes } from "@/types/game-types";

type GameState = {
  page: GamePageProps;
  difficulty: LevelTypes | null;
  category: string | "random";
  voice: boolean;
  setPage: (page: GamePageProps) => void;
  setDifficulty: (level: LevelTypes) => void;
  setCategory: (category: string) => void;
  setVoice: (voice: boolean) => void;
};

export const useGameStore = create<GameState>((set) => ({
  page: "home",
  difficulty: null,
  category: "random",
  voice: false,
  setPage: (page: GamePageProps) => set((s) => ({ page })),
  setDifficulty: (level: LevelTypes) => set((s) => ({ difficulty: level })),
  setCategory: (category: string) => set((s) => ({ category })),
  setVoice: (voice: boolean) => set((s) => ({ voice })),
}));
