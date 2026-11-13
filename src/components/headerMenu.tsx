import { levelOptions, resetGame } from "@/lib/utils";
import { useGameStore } from "@/store/gameStore";
import type { LevelKey } from "@/types/game-types";

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
  const levels = Object.keys(levelOptions) as LevelKey[];
  const filteredLevels = levels.filter((level) => level !== difficulty);

  const endGame = () => {
    setDifficulty(null);
    setPage("home");
  };

  return (
    <Menubar className="w-full">
      <MenubarMenu>
        <MenubarTrigger
          className="hover:cursor-pointer"
          onClick={() => resetGame()}
        >
          Restart
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <Dialog>
          <DialogTrigger>Home</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                If you go back to the home page, your current game progress will
                be lost. Are you sure you want to continue?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={() => endGame()}>Continue</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="hover:cursor-pointer">
          Difficulty
        </MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger className="capitalize">
              {difficulty}
            </MenubarSubTrigger>
            <MenubarSubContent>
              {filteredLevels.map((level) => (
                <MenubarItem
                  key={level}
                  className="capitalize"
                  onClick={() => setDifficulty(level)}
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
