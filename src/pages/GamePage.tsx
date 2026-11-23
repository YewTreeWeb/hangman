import { FeelingLucky } from "@/components/feelingLucky";
import { Keyboard, PowerBar, Stats, WordDisplay } from "@/components/gameBoard";
import {
  FailedPowerDialog,
  RevealDialog,
  RevivalDialog,
  RoundLostDialog,
  RoundWonDialog,
  ShieldDialog,
} from "@/components/gameDialogs";
import { HangmanDrawing } from "@/components/HangmanDrawing";
import { HeaderMenu } from "@/components/headerMenu";
import { useGuess } from "@/hooks/useGuess";
import { usePowers } from "@/hooks/usePowers";
import { useAutoAdvance } from "@/hooks/useRoundTimers";
import { wrongGuesses } from "@/lib/guess";
import { getWord, wordPoints } from "@/lib/utils";
import { useGameStore, useUserStore } from "@/store/gameStore";
import type { LevelKey } from "@/types/game-types";

export function GamePage({ difficulty }: { difficulty: LevelKey }) {
  const { category, round, setRound } = useGameStore();
  const { score, lives, streak, activePowers } = useUserStore();
  const { word, hint, guessedLetters, status } = round;

  // Called on click, after useGuess below has run
  const power = usePowers(difficulty, () => revealWord());

  const { guessedLetter, revealWord, earned } = useGuess(
    difficulty,
    power.zapped,
    power.shields,
  );

  const gameWon = status === "won";
  const gameLost = status === "lost";
  const roundOver = gameWon || gameLost;

  const loading = useAutoAdvance(roundOver, lives, () => {
    setRound({
      ...getWord(category, difficulty),
      guessedLetters: [],
      status: "in-progress",
    });
    power.resetPowers(gameLost);
  });

  return (
    <div className="relative z-10 mx-auto flex w-dvh flex-col gap-4 p-4 text-center">
      <div className="flex flex-col items-center justify-center gap-8">
        <HeaderMenu />
        <Stats
          score={score}
          streak={streak}
          lives={lives}
          shield={power.shieldKind}
          extraLife={power.extraLife && !gameLost}
          poisoned={power.poisoned}
        />
      </div>
      <section className="my-3 grid grid-cols-2 items-center justify-center gap-14">
        <div>
          <HangmanDrawing
            wrongGuesses={wrongGuesses(word, guessedLetters)}
            difficulty={difficulty}
          />
        </div>
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center justify-start">
            <h6 className="text-left text-sm font-bold">{category}</h6>
            {power.showClue && !roundOver && (
              <>
                <span className="ml-4 text-xs uppercase">hint:</span>
                <span className="ml-1 text-xs">{hint}</span>
              </>
            )}
          </div>
          <WordDisplay
            word={word}
            guessedLetters={guessedLetters}
            status={status}
          />
          <span className="mt-2 text-xs">{`Worth ${wordPoints(word, difficulty)} points`}</span>
        </div>
      </section>
      <PowerBar
        powers={power.powers}
        specialPowers={power.specialPowers}
        wonPowers={power.wonPowers}
        hideClue={power.alwaysShowClue}
        onUseSpecial={power.useSpecialPower}
      />
      <FeelingLucky
        difficulty={difficulty}
        specialPowers={power.specialPowers}
        rollBlocked={power.rollBlocked}
        onWin={(name) => power.addWonPower(name, 1)}
      />
      <Keyboard
        guessedLetters={guessedLetters}
        zapped={power.zapped}
        disabled={roundOver}
        onGuess={guessedLetter}
      />
      <RoundLostDialog
        open={gameLost}
        word={word}
        dead={lives === 0}
        shielded={power.shieldKind !== "none"}
        loading={loading}
      />
      <RoundWonDialog open={gameWon} earned={earned} loading={loading} />
      <RevealDialog
        open={power.revealing}
        word={word}
        guessedLetters={guessedLetters}
        onReveal={(letter) => {
          guessedLetter(letter);
          power.finishReveal();
        }}
        onCancel={power.cancelReveal}
      />
      <ShieldDialog open={power.showShield} />
      <RevivalDialog
        open={power.reviving}
        usedPowers={activePowers}
        onRestore={power.reviveUsedPower}
      />
      <FailedPowerDialog
        open={power.failedPower}
        poisoned={power.poisoned}
        onClose={power.closeFailedPower}
      />
    </div>
  );
}
