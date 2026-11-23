import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

import { FeelingLucky } from "@/components/feelingLucky";
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
import { Powers } from "@/components/powers";
import { Button } from "@/components/ui/button";
import { useGuess } from "@/hooks/useGuess";
import { useAutoAdvance, useAutoClose } from "@/hooks/useRoundTimers";
import { wrongGuesses } from "@/lib/guess";
import { getPowers, getSpecialPowers } from "@/lib/powerList";
import { cn, getWord, wordPoints } from "@/lib/utils";
import { useGameStore, useUserStore } from "@/store/gameStore";
import type { LevelKey } from "@/types/game-types";

export function GamePage({ difficulty }: { difficulty: LevelKey }) {
  const { category, round, setRound, setUnlockPowers, unlockPowers } =
    useGameStore();

  const {
    score,
    lives,
    streak,
    setStreak,
    setLives,
    activePowers,
    setActivePowers,
  } = useUserStore();

  const [showClue, setShowClue] = useState<boolean>();
  const [activeShield, setActiveShield] = useState(false);
  const [activeSuperShield, setActiveSuperShield] = useState(false);
  const [zapped, setZapped] = useState<string[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showShield, setShowShield] = useState(false);
  const [extraLife, setExtraLife] = useState(false);
  const [revivePower, setRevivePower] = useState(false);
  const [wonPowers, setWonPowers] = useState<Record<string, number>>({});
  const [isPoisoned, setIsPoisoned] = useState(false);
  const [failedPower, setFailedPower] = useState(false);
  const [alwaysShowClue, setAlwaysShowClue] = useState(false);

  const { word, hint, guessedLetters, status } = round;

  const { guess, revealWord, earned } = useGuess(difficulty, zapped, {
    shield: activeShield,
    superShield: activeSuperShield,
  });

  const resetPowers = () => {
    if (!alwaysShowClue) setShowClue(false);
    setActiveShield(false);
    setExtraLife(false);
    setRevivePower(false);
    setZapped([]);
  };

  const zappedLetters = (amount: number) => {
    const wrong = kbdKeys
      .flat()
      .filter((l) => !word.includes(l) && !guessedLetters.includes(l));

    setZapped(wrong.sort(() => Math.random() - 0.5).slice(0, amount));
  };

  const kbdKeys = ["qwertyuiop", "asdfghjkl", "zxcvbnm"].map((row) => [...row]);
  const hardMode = difficulty === "hard" || difficulty === "executioner";
  const sideEffect = (chance: number) => hardMode && Math.random() < chance;

  const powerState = {
    lives,
    usedPowers: activePowers,
    unlockPowers: !!unlockPowers,
  };

  const powers = getPowers(
    {
      clue: () => setShowClue(true),
      reveal: () => setIsRevealed(true),
      shield: () => {
        setActiveShield(true);
        setShowShield(true);
      },
      skip: () => {
        setTimeout(() => {
          setRound({
            ...getWord(category, difficulty),
            guessedLetters: [],
            status: "in-progress",
          });
          resetPowers();
        }, 1000);
      },
      zap: () => zappedLetters(5),
    },
    difficulty,
    powerState,
  );

  const specialPowers = getSpecialPowers(
    {
      potion: () => {
        if (sideEffect(0.1)) {
          setFailedPower(true);

          return;
        }

        if (lives > 0 && lives < 3) setLives(lives + 1);
      },
      redPotion: () => {
        if (sideEffect(0.1)) {
          setIsPoisoned(true);
          setFailedPower(true);
          setTimeout(() => {
            setLives(lives - 1);
            setIsPoisoned(false);
          }, 1000);

          return;
        }

        if (lives > 0 && lives < 3) setLives(lives + 2);
        setExtraLife(true);
      },
      revival: () => {
        if (sideEffect(0.2)) {
          setFailedPower(true);

          return;
        }

        setRevivePower(true);
      },
      superZap: () => zappedLetters(10),
      superShield: () => {
        setActiveSuperShield(true);
        setShowShield(true);
      },
      bernardsWatch: () => {},
      magicStar: () => {
        setStreak(streak + 50);

        if (!unlockPowers) setUnlockPowers(true);

        if (unlockPowers && !alwaysShowClue) {
          setAlwaysShowClue(true);
          setShowClue(true);
        }

        revealWord();
      },
    },
    difficulty,
    powerState,
  );

  // executioner can only hold one special power at a time
  const rollBlocked =
    difficulty === "executioner" &&
    Object.values(wonPowers).some((count) => count > 0);

  const wrongLetter = wrongGuesses(word, guessedLetters);
  const gameWon = status === "won";
  const gameLost = status === "lost";
  const roundOver = gameWon || gameLost;

  const shielded = activeShield || activeSuperShield;
  const dead = lives === 0;

  const loading = useAutoAdvance(status !== "in-progress", lives, () => {
    setRound({
      ...getWord(category, difficulty),
      guessedLetters: [],
      status: "in-progress",
    });

    if (gameLost) setActiveSuperShield(false);
    resetPowers();
  });

  // Frees one use so the power button enables again
  const cancelPower = (power: string) => {
    const index = activePowers.indexOf(power);

    if (index !== -1) setActivePowers(activePowers.toSpliced(index, 1));
  };

  useAutoClose(showShield, () => setShowShield(false), 3000);

  return (
    <div className="relative z-10 mx-auto flex w-dvh flex-col gap-4 p-4 text-center">
      <div className="flex flex-col items-center justify-center gap-8">
        <HeaderMenu />
        <div className="flex w-full flex-row items-center justify-between gap-2">
          <div className="flex items-center justify-start gap-6">
            <div className="flex flex-col gap-1 text-sm">
              <span>Score</span>
              <span className="text-lg font-bold">{score}</span>
            </div>
            <div className={"flex flex-col gap-1 text-sm"}>
              <span>Streak</span>
              <span
                className={cn(
                  "text-lg font-bold",
                  activeSuperShield ? "text-teal-400" : "text-black",
                )}
              >
                {streak}
              </span>
            </div>
          </div>
          <div
            className="flex flex-col gap-1 text-sm"
            aria-label={`${lives} lives remaining`}
          >
            <span>Lives</span>
            <div
              className={cn(
                "flex gap-x-2",
                activeShield
                  ? "text-blue-400"
                  : activeSuperShield
                    ? "text-teal-400"
                    : "text-red-400",
              )}
            >
              {Array.from({ length: lives }, (_, i) => (
                <span key={i}>
                  <FontAwesomeIcon
                    icon={faHeart}
                    size="lg"
                    className={cn(
                      extraLife && !gameLost && i === 0
                        ? "text-yellow-400! drop-shadow-[0_0_0.25rem_var(--color-yellow-300)] dark:text-yellow-300!"
                        : isPoisoned && i === 0
                          ? "text-green-700! dark:text-green-600!"
                          : "",
                    )}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <section className="my-3 grid grid-cols-2 items-center justify-center gap-14">
        <div>
          <HangmanDrawing wrongGuesses={wrongLetter} difficulty={difficulty} />
        </div>
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center justify-start">
            <h6 className="text-left text-sm font-bold">{category}</h6>
            {showClue && !roundOver && (
              <>
                <span className="ml-4 text-xs uppercase">hint:</span>
                <span className="ml-1 text-xs">{hint}</span>
              </>
            )}
          </div>
          <div className="flex items-center justify-center gap-x-3">
            <>
              {[...word].map((char, i) => (
                <div key={i} className="w-6">
                  <span
                    className={cn(
                      "text-4xl font-bold uppercase",
                      guessedLetters.includes(char) || gameLost || gameWon
                        ? "visible"
                        : "invisible",
                      !guessedLetters.includes(char) && gameLost
                        ? "text-red-500"
                        : "text-black",
                    )}
                  >
                    {char}
                  </span>
                  <hr
                    className={cn(
                      "border-b",
                      !guessedLetters.includes(char) && gameLost
                        ? "border-red-500/70"
                        : "border-black/70",
                    )}
                  />
                </div>
              ))}
            </>
          </div>
          <span className="mt-2 text-xs">{`Worth ${wordPoints(word, difficulty)} points`}</span>
        </div>
      </section>
      <section>
        <div className="flex flex-col gap-4">
          <h5 className="text-left text-xs uppercase">Powers</h5>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-5">
            {powers.map((power) => (
              <Powers
                key={power.name}
                {...power}
                className={cn(
                  alwaysShowClue && power.name === "Clue" ? "hidden" : "",
                )}
              />
            ))}
            {specialPowers
              .filter((power) => (wonPowers[power.name] ?? 0) > 0)
              .map((power) => (
                <Powers
                  key={power.name}
                  {...power}
                  multiUse={(wonPowers[power.name] ?? 0) > 1}
                  uses={wonPowers[power.name]}
                  onUse={() => {
                    setWonPowers((prev) => ({
                      ...prev,
                      [power.name]: (prev[power.name] ?? 0) - 1,
                    }));
                    power.onUse();
                  }}
                />
              ))}
          </div>
        </div>
      </section>

      <FeelingLucky
        difficulty={difficulty}
        specialPowers={specialPowers}
        rollBlocked={rollBlocked}
        onWin={(name) =>
          setWonPowers((prev) => ({ ...prev, [name]: (prev[name] ?? 0) + 1 }))
        }
      />
      <section className="flex flex-col items-center justify-center gap-1">
        {kbdKeys.map((kdb, i) => (
          <div key={kdb[i]} className="flex items-center justify-center gap-1">
            {kdb.map((char, i) => (
              <Button
                key={i}
                variant="outline"
                className={cn(
                  "uppercase",
                  zapped.includes(char)
                    ? "hidden border border-orange-300 text-orange-300 hover:bg-yellow-100 hover:text-orange-300"
                    : "text-black",
                )}
                onClick={() => guess(char)}
                disabled={
                  guessedLetters.includes(char) ||
                  gameLost ||
                  gameWon ||
                  zapped.includes(char)
                }
              >
                {char}
              </Button>
            ))}
          </div>
        ))}
      </section>
      <RoundLostDialog
        open={gameLost}
        word={word}
        dead={dead}
        shielded={shielded}
        loading={loading}
      />
      <RoundWonDialog open={gameWon} earned={earned} loading={loading} />
      <RevealDialog
        open={isRevealed}
        word={word}
        guessedLetters={guessedLetters}
        onReveal={(letter) => {
          guess(letter);
          setIsRevealed(false);
        }}
        onCancel={() => {
          cancelPower("Reveal");
          setIsRevealed(false);
        }}
      />
      <ShieldDialog open={showShield} />
      <RevivalDialog
        open={revivePower}
        usedPowers={activePowers}
        onRestore={(power) => {
          setRevivePower(false);
          cancelPower(power);
        }}
      />
      <FailedPowerDialog
        open={failedPower}
        poisoned={isPoisoned}
        onClose={() => setFailedPower(false)}
      />
    </div>
  );
}
