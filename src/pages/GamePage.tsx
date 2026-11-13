import { HeaderMenu } from "@/components/headerMenu";
import { Powers } from "@/components/powers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { wordPoints } from "@/lib/utils";
import { useGameStore, useUserStore } from "@/store/gameStore";
import type { PowerTypes } from "@/types/game-types";

export function GamePage() {
  const { category, difficulty, round, setRound } = useGameStore();
  const { score, lives, setScore, solved, streak } = useUserStore();

  const { word, hint } = round;

  const powers: PowerTypes[] = [
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

  const kbdKeys = ["qwertyuiop", "asdfghjkl", "zxcvbnm"].map((row) => [...row]);

  const feelingLucky = () => {
    setScore(score - 250);
  };

  return (
    <div className="relative z-10 container mx-auto p-4 text-center">
      <div className="mb-8 flex items-center justify-center gap-8">
        <HeaderMenu />
        <div className="flex flex-col items-center gap-2">
          <div>
            <span>Score</span>
            <span>{score}</span>
          </div>
          <div aria-label={`${lives} lives remaining`}>
            <span>Lives</span>
            {Array.from({ length: lives }, (_, i) => (
              <span key={i}>❤️</span>
            ))}
          </div>
        </div>
        <div>
          <span>{hint}</span>
        </div>
      </div>
      <section className="grid grid-cols-2 gap-4">
        <div></div>
        <div>
          <h6>{category}</h6>
          <div className="flex items-center justify-center gap-x-3">
            <>
              {[...word].map((char, i) => (
                <div key={i} className="w-full min-w-4">
                  <span className="opacity text-lg">{char}</span>
                  <hr className="border-b border-black/70" />
                </div>
              ))}
            </>
          </div>
          <span>{`Worth ${wordPoints(word, difficulty)} points`}</span>
        </div>
      </section>
      <section>
        <div className="flex items-center justify-center gap-4">
          <h5>Powers</h5>
          <div>
            {powers.map((power) => (
              <Powers key={power.name} {...power} />
            ))}
          </div>
        </div>
      </section>
      {difficulty !== "hard" && difficulty !== "executioner" && (
        <section>
          <Button onClick={feelingLucky} disabled={score < 250}>
            Feeling Lucky <Badge>250 pts</Badge>
          </Button>
        </section>
      )}
      <section>
        {kbdKeys.map((kdb, i) => (
          <div key={kdb[i]}>
            {kdb.map((char, i) => (
              <Button
                key={i}
                variant="outline"
                className="uppercase"
                onClick={() =>
                  setRound({
                    guessedLetters: [...round.guessedLetters, char],
                  })
                }
                disabled={round.wrongLetters.includes(char)}
              >
                {char}
              </Button>
            ))}
          </div>
        ))}
      </section>
      <section>
        <div>
          <span>Solved</span>
          <span>{solved}</span>
        </div>
        <div>
          <span>Streak</span>
          <span>{streak}</span>
        </div>
      </section>
    </div>
  );
}
