import { DifficultyLevel } from "@/components/difficultyLevel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import "@/index.css";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/gameStore";

export function HomePage() {
  const {
    setCategory,
    setVoice: toggleVoice,
    voice,
    setPage,
    difficulty,
  } = useGameStore();
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
    <div className="relative z-10 container mx-auto p-4 text-center">
      <div className="mb-8 flex items-center justify-center gap-8">
        <h1 className="text-4xl font-bold">Hangman</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Difficulty Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <DifficultyLevel
            level="Easy"
            tries={14}
            timer={false}
            powers={true}
          />
          <DifficultyLevel level="Medium" tries={10} timer={true} powers={2} />
          <DifficultyLevel level="Hard" tries={8} timer={true} powers={1} />
          <DifficultyLevel
            level="Executioner"
            tries={5}
            timer={true}
            powers={false}
          />
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
      <Item variant="outline">
        <ItemMedia></ItemMedia>
        <ItemContent>
          <ItemTitle className="font-bold">Voice</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" onClick={() => toggleVoice(!voice)}>
            {voice ? "Disable" : "Enable"}
          </Button>
        </ItemActions>
      </Item>
      <Button
        className={cn("w-full", !difficulty && "hover:cursor-not-allowed")}
        disabled={!difficulty}
        onClick={() => setPage("game")}
      >
        Play
      </Button>
    </div>
  );
}
