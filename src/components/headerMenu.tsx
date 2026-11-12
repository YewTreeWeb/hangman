import { useGameStore, useUserStore } from "@/store/gameStore";
import type { LevelTypes } from "@/types/game-types";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "./ui/menubar";

export function HeaderMenu() {
  const { difficulty, setDifficulty, setPage } = useGameStore();
  const { setScore, setLives, setSolved } = useUserStore();
  const levels = ["Easy", "Medium", "Hard", "Executioner"];
  const filteredLevels = levels.filter((level) => level !== difficulty);

  const restartGame = () => {
    // Reset game state logic here
    setScore(0);
    setLives(3);
    setSolved(0);
  };

  return (
    <Menubar className="w-full">
      <MenubarMenu>
        <MenubarTrigger className="hover:cursor-pointer" onClick={restartGame}>
          Restart
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="hover:cursor-pointer">
          <Dialog>
            <DialogTrigger>Home</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  If you go back to the home page, your current game progress
                  will be lost. Are you sure you want to continue?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={() => setPage("home")}>Continue</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
    </Menubar>
  );
}
