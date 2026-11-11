import type { ReactNode } from "react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/gameStore";
import type { LevelTypes } from "@/types/game-types";

export function GamePage() {
  const { difficulty, setDifficulty, category, setPage } = useGameStore();
  const levels = ["Easy", "Medium", "Hard", "Executioner"];
  const filteredLevels = levels.filter((level) => level !== difficulty);

  type PowerTypes = {
    name: string;
    description: string;
    Icon: () => ReactNode;
    active: boolean;
    multiUse?: boolean;
    uses?: number;
  }[];

  const powers: PowerTypes = [
    {
      name: "Clue",
      description: "Provides a hint for the current word.",
      Icon: () => <span>💡</span>,
      multiUse: false,
      active: true,
    },
    {
      name: "Reveal",
      description: "Reveals a letter in the current word.",
      Icon: () => <span>🔍</span>,
      multiUse: false,
      active: true,
    },
    {
      name: "Shield",
      description: "Protects the player from one incorrect guess.",
      Icon: () => <span>🛡️</span>,
      multiUse: false,
      active: true,
    },
    {
      name: "Skip",
      description: "Skips the current word.",
      Icon: () => <span>⏩</span>,
      multiUse: false,
      active: true,
    },
    {
      name: "Zap",
      description: "Removes five incorrect letters from the current word.",
      Icon: () => <span>⚡</span>,
      multiUse: false,
      active: false,
    },
    {
      name: "Phone a Friend",
      description: "Calls a random AI agent for help with the current word.",
      Icon: () => <span>📞</span>,
      multiUse: false,
      active: true,
    },
  ];

  return (
    <div className="relative z-10 container mx-auto p-4 text-center">
      <div className="mb-8 flex items-center justify-center gap-8">
        <Menubar className="w-full">
          <MenubarMenu>
            <MenubarTrigger className="hover:cursor-pointer">
              Score
            </MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger
              className="hover:cursor-pointer"
              onClick={() => setPage("home")}
            >
              Home
            </MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="hover:cursor-pointer">
              Difficulty
            </MenubarTrigger>
            <MenubarContent>
              <MenubarSub>
                <MenubarSubTrigger>{difficulty}</MenubarSubTrigger>
                <MenubarSubContent>
                  {filteredLevels.map((level) => (
                    <MenubarItem
                      key={level}
                      onClick={() => setDifficulty(level as LevelTypes)}
                    >
                      {level}
                    </MenubarItem>
                  ))}
                </MenubarSubContent>
              </MenubarSub>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="hover:cursor-pointer">
              Lives
            </MenubarTrigger>
          </MenubarMenu>
        </Menubar>
      </div>
      <section className="grid grid-cols-2 gap-4">
        <div></div>
        <div>
          <h6>{category}</h6>
          <span>_</span>
          <span>Worth 50 points</span>
        </div>
      </section>
      <section>
        <div className="flex items-center justify-center gap-4">
          <h5>Powers</h5>
          <div>
            {powers.map((power) => (
              <HoverCard>
                <HoverCardTrigger>
                  <Item
                    className={cn(
                      "flex items-center gap-2",
                      !power.active && "opacity-50",
                    )}
                  >
                    <ItemMedia>{power.Icon()}</ItemMedia>
                    <ItemContent>
                      <ItemTitle>{power.name}</ItemTitle>
                    </ItemContent>
                  </Item>
                </HoverCardTrigger>
                <HoverCardContent>
                  <span>{power.description}</span>
                  {power.multiUse && (
                    <span>Uses before inactive: {power.uses}</span>
                  )}
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
