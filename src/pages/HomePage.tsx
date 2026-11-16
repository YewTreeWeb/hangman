import { DifficultyLevel } from "@/components/difficultyLevel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "@/index.css";
import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { cn, getWord, levelOptions, resetGame } from "@/lib/utils";
import { useGameStore } from "@/store/gameStore";
import type { LevelKey } from "@/types/game-types";

export function HomePage() {
  const { setCategory, setPage, difficulty, category, setRound } =
    useGameStore();

  const startGame = () => {
    if (!difficulty) return;
    setRound({
      ...getWord(category, difficulty),
    });
    resetGame();
    setPage("game");
  };
  const categories = [
    "Random",
    "Animals",
    "Food",
    "Science",
    "Geography",
    "Movies",
    "Music",
    "Sports",
    "Technology",
    "History",
    "Art",
    "Mythology",
    "Nature",
    "Structure",
    "Languages",
    "Weather",
    "Gems",
    "Tools",
    "Places",
    "Objects",
  ];

  return (
    <div className="container mx-auto flex flex-col items-center justify-center gap-8 px-20 py-5">
      <div className="mb-8 flex flex-1 flex-col items-center justify-center gap-4">
        <FontAwesomeIcon icon={faGamepad} size="5x" />
        <h1 className="text-4xl font-bold">Hangman Game</h1>
      </div>
      <Card className="w-full gap-3 border-none bg-transparent p-0 shadow-none">
        <CardHeader>
          <CardTitle className="text-xs uppercase">Difficulty Levels</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-3 px-0">
          {(Object.keys(levelOptions) as LevelKey[]).map((level) => (
            <DifficultyLevel
              active={level === difficulty}
              key={level}
              level={level}
              {...levelOptions[level]}
            />
          ))}
        </CardContent>
      </Card>
      <Card className="w-full gap-3 border-none bg-transparent p-0 shadow-none">
        <CardHeader>
          <CardTitle className="text-xs uppercase">Category</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-start gap-2">
          {categories.map((cat) => (
            <Button
              className={cn(
                "rounded-full text-xs shadow-none",
                cat === category
                  ? "border-2 border-lime-600 bg-lime-600/30 hover:bg-lime-600/50"
                  : "border-2 bg-transparent",
              )}
              variant="outline"
              size="sm"
              key={cat}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </CardContent>
      </Card>
      <Button
        className={cn(
          "w-full border-2 border-lime-600 bg-lime-600 uppercase hover:bg-lime-700 disabled:border-lime-700/40 disabled:bg-lime-600/40 disabled:text-black/80",
          !difficulty && "hover:cursor-not-allowed",
        )}
        size="lg"
        disabled={!difficulty}
        onClick={startGame}
      >
        Play
      </Button>
    </div>
  );
}
