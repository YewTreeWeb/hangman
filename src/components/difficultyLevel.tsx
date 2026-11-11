import { useGameStore } from "@/store/gameStore";
import type { LevelTypes } from "@/types/level-types";

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
  level: LevelTypes;
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
  console.log("🚀 ~ DifficultyLevel ~ difficulty:", difficulty);

  return (
    <ItemGroup>
      <Item variant="outline">
        <ItemActions>
          <button onClick={() => setDifficulty(level)}>
            <ItemMedia></ItemMedia>
            <ItemContent>
              <ItemTitle className="font-bold">
                <img></img>
                {level}
              </ItemTitle>
              <ItemDescription>
                <ul>
                  <li>{tries} tries</li>
                  <li>{timer ? "With timer" : "No timer"}</li>
                  <li>
                    {powers
                      ? `${level === "Easy" ? "All powers" : `${numPowers} powers`}`
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
