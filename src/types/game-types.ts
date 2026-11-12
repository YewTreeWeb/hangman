import type { ReactNode } from "react";

export type LevelTypes = "Easy" | "Medium" | "Hard" | "Executioner";
export type GamePageProps = "home" | "game" | "result";

export type PowerTypes = {
  name: string;
  description: string;
  Icon: () => ReactNode;
  active: boolean;
  multiUse?: boolean;
  uses?: number;
};
