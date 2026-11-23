import { useGameStore } from "@/store/gameStore";
import type { LevelKey } from "@/types/game-types";

import { Button } from "./ui/button";
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
  active: boolean;
};

export function DifficultyLevel({
  level,
  tries,
  timer,
  powers,
  active = false,
}: DifficultyLevelProps) {
  const { setDifficulty, difficulty } = useGameStore();

  return (
    <Button
      variant="outline"
      className={`h-full w-full p-0 shadow-none ${active ? "border-2 border-lime-600 bg-lime-600/30 hover:bg-lime-600/50" : "border-2 bg-transparent"}`}
      onClick={() => setDifficulty(level)}
    >
      <ItemGroup className="w-full">
        <Item
          variant="outline"
          className="flex w-full items-center justify-start border-none"
        >
          <ItemActions className="flex-1">
            <ItemMedia></ItemMedia>
            <ItemContent className="flex flex-row items-center justify-start gap-5">
              <ItemTitle className="font-bold capitalize">
                <img></img>
                {level}
              </ItemTitle>
              <ItemDescription asChild>
                <ul className="flex w-full items-center justify-start gap-2.5 text-xs *:flex *:items-center *:gap-2.5 *:after:size-1 *:after:rounded-full *:after:bg-black/70 *:last:after:hidden">
                  <li>{tries} tries</li>
                  <li>{timer ? "With timer" : "No timer"}</li>
                  <li>
                    {powers
                      ? powers === true
                        ? "All powers"
                        : `${powers} powers`
                      : "No powers"}
                  </li>
                </ul>
              </ItemDescription>
            </ItemContent>
          </ItemActions>
        </Item>
      </ItemGroup>
    </Button>
  );
}
