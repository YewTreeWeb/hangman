import { DifficultyLevel } from "@/components/difficultyLevel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "@/index.css";
import { cn, getWord, levelOptions } from "@/lib/utils";
import { useGameStore } from "@/store/gameStore";
import type { LevelKey } from "@/types/game-types";

export function HomePage() {
  const { setCategory, setPage, difficulty, category, setRound } =
    useGameStore();

  const startGame = () => {
    if (!difficulty) return;
    setRound({
      ...getWord(category, difficulty),
      guessedLetters: [],
      wrongLetters: [],
      wrongGuesses: 0,
      status: "in-progress",
    });
    setPage("game");
  };
  console.log("🚀 ~ HomePage ~ difficulty:", difficulty);
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
    <div className="container mx-auto flex flex-col items-center justify-center gap-8 p-10">
      <div className="flex flex-1 items-center justify-center gap-8">
        <h1 className="text-4xl font-bold">Hangman</h1>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Difficulty Levels</CardTitle>
        </CardHeader>
        <CardContent>
          {(Object.keys(levelOptions) as LevelKey[]).map((level) => (
            <DifficultyLevel
              key={level}
              level={level}
              {...levelOptions[level]}
            />
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Category</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.map((category) => (
            <Badge
              variant="outline"
              key={category}
              onClick={() => setCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </CardContent>
      </Card>
      <Button
        className={cn("w-full", !difficulty && "hover:cursor-not-allowed")}
        disabled={!difficulty}
        onClick={startGame}
      >
        Play
      </Button>
    </div>
  );
}
