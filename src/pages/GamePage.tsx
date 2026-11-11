import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
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
import { useGameStore } from "@/store/gameStore";
import type { LevelTypes } from "@/types/game-types";

export function GamePage() {
  const { difficulty, setDifficulty, category } = useGameStore();
  const levels = ["Easy", "Medium", "Hard", "Executioner"];
  const filteredLevels = levels.filter((level) => level !== difficulty);

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
            <MenubarTrigger className="hover:cursor-pointer">
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
            <HoverCard>
              <HoverCardTrigger>
                <Button variant="outline">Power</Button>
              </HoverCardTrigger>
              <HoverCardContent>
                <span>This is a power-up!</span>
                <span>Only single use</span>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </section>
    </div>
  );
}
