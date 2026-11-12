import { HeaderMenu } from "@/components/headerMenu";
import { Powers } from "@/components/powers";
import { useGameStore, useUserStore } from "@/store/gameStore";
import type { PowerTypes } from "@/types/game-types";

export function GamePage() {
  const { category } = useGameStore();
  const { score, lives, setScore, setLives, setSolved } = useUserStore();

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
      </div>
      <section className="grid grid-cols-2 gap-4">
        <div></div>
        <div>
          <h6>{category}</h6>
          <div>
            <span>H</span>
            <span>E</span>
            <span>L</span>
            <span>L</span>
            <span>O</span>
          </div>
          <span>Worth 50 points</span>
        </div>
      </section>
      <section>
        <div className="flex items-center justify-center gap-4">
          <h5>Powers</h5>
          <div>
            {powers.map((power) => (
              <Powers {...power} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
