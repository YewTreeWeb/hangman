import { create } from "zustand";

import type { LevelTypes } from "@/types/level-types";

type GameState = {
  difficulty: LevelTypes | null;
  category: string | null;
  voice: boolean;
  setDifficulty: (level: LevelTypes) => void;
  setCategory: (category: string) => void;
  setVoice: (voice: boolean) => void;
};

export const useGameStore = create<GameState>((set) => ({
  difficulty: null,
  category: null,
  voice: false,
  setDifficulty: (level: LevelTypes) => set((s) => ({ difficulty: level })),
  setCategory: (category: string) => set((s) => ({ category })),
  setVoice: (voice: boolean) => set((s) => ({ voice })),
}));
