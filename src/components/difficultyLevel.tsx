import { useGameStore } from "@/store/gameStore";
import type { LevelKey } from "@/types/game-types";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "./ui/item";

type DifficultyLevelProps = {
  level: LevelKey;
  tries: number;
  timer: boolean;
  powers: boolean | number;
};

export function DifficultyLevel({
  level,
  tries,
  timer,
  powers,
}: DifficultyLevelProps) {
  const numPowers = typeof powers === "number" ? powers : 0;
  const { setDifficulty, difficulty } = useGameStore();

  return (
    <ItemGroup>
      <Item variant="outline">
        <ItemActions>
          <button onClick={() => setDifficulty(level)}>
            <ItemMedia></ItemMedia>
            <ItemContent>
              <ItemTitle className="font-bold capitalize">
                <img></img>
                {level}
              </ItemTitle>
              <ItemDescription asChild>
                <ul>
                  <li>{tries} tries</li>
                  <li>{timer ? "With timer" : "No timer"}</li>
                  <li>
                    {powers
                      ? `${level === "easy" ? "All powers" : `${numPowers} powers`}`
                      : "No powers"}
                  </li>
                </ul>
              </ItemDescription>
            </ItemContent>
          </button>
        </ItemActions>
      </Item>
    </ItemGroup>
  );
}
