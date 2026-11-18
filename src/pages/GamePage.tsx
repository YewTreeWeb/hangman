import {
  faCircleXmark,
  faDice,
  faFaceGrinStars,
  faHeart,
  faRepeat,
  faShield,
  faShieldHeart,
  faSkull,
  faSkullCrossbones,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

import { HangmanDrawing } from "@/components/HangmanDrawing";
import { HeaderMenu } from "@/components/headerMenu";
import { Powers } from "@/components/powers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { getPowers, getSpecialPowers } from "@/lib/powerList";
import { cn, endGame, getWord, wordPoints } from "@/lib/utils";
import { useGameStore, useUserStore } from "@/store/gameStore";

export function GamePage() {
  const {
    category,
    difficulty,
    round,
    setRound,
    match,
    setMatch,
    setUnlockPowers,
    unlockPowers,
  } = useGameStore();
  const {
    score,
    lives,
    setScore,
    streak,
    setStreak,
    setLives,
    activePowers,
    setActivePowers,
  } = useUserStore();
  const [showClue, setShowClue] = useState<boolean>();
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeShield, setActiveShield] = useState(false);
  const [activeSuperShield, setActiveSuperShield] = useState(false);
  const [zapped, setZapped] = useState<string[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showShield, setShowShield] = useState(false);
  const [showFeelingLucky, setShowFeelingLucky] = useState(false);
  const [extraLife, setExtraLife] = useState(false);
  const [revivePower, setRevivePower] = useState(false);
  const [rolling, setRolling] = useState(false);
  // undefined = not rolled yet, null = rolled nothing
  const [luckyResult, setLuckyResult] = useState<string | null>();
  const [wonPowers, setWonPowers] = useState<Record<string, number>>({});
  const [isPoisoned, setIsPoisoned] = useState(false);
  const [restorePower, setRestorePower] = useState("");
  const [failedPower, setFailedPower] = useState(false);
  const [alwaysShowClue, setAlwaysShowClue] = useState(false);

  const { word, hint, guessedLetters, status } = round;

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
        if (!unlockPowers) setUnlockPowers?.(true);
        if (unlockPowers && !alwaysShowClue) {
          setAlwaysShowClue(true);
          setShowClue(true);
        }
        setRound({
          guessedLetters: [...new Set([...guessedLetters, ...word])],
          status: "won",
        });
        setSuccess(true);
      },
    },
    difficulty,
  );

  const executioner = difficulty === "executioner";
  const easy = difficulty === "easy";
  const rollCost = executioner ? 1000 : easy ? 250 : 500;

  // executioner can only hold one special power at a time
  const rollBlocked =
    executioner && Object.values(wonPowers).some((count) => count > 0);

  const feelingLucky = () => {
    setScore(score - rollCost);
    setRolling(true);
    setTimeout(() => {
      // one extra slot past the end of the list is the "nothing" outcome,
      // except on executioner where a roll always wins
      const nothingWeight = executioner ? 0 : 10;
      const total =
        specialPowers.reduce((sum, p) => sum + (p.weight ?? 10), 0) +
        nothingWeight;
      let roll = Math.random() * total;
      const won = specialPowers.find((p) => (roll -= p.weight ?? 10) < 0);
      const name = won?.name ?? null;
      if (name) {
        setWonPowers((prev) => ({ ...prev, [name]: (prev[name] ?? 0) + 1 }));
      }
      setLuckyResult(name);
      setRolling(false);
    }, 1500);
  };

  const closeFeelingLucky = () => {
    setShowFeelingLucky(false);
    const luckyResult = setTimeout(() => {
      setLuckyResult(undefined);
    }, 1000);
    return () => clearTimeout(luckyResult);
  };

  const wrongLetter = guessedLetters.filter(
    (letter) => !word.includes(letter),
  ).length;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (!key.match(/^[a-z]$/)) return;

      e.preventDefault();
      guessedLetter(key);
    };

    document.addEventListener("keypress", handler);

    return () => {
      document.removeEventListener("keypress", handler);
    };
  });

  const gameLost =
    (hardMode && wrongLetter >= 6) || (!hardMode && wrongLetter >= 11);
  const gameWon = [...word].every((letter) => guessedLetters.includes(letter));

  const guessedLetter = (letter: string) => {
    if (
      guessedLetters.includes(letter) ||
      zapped.includes(letter) ||
      status !== "in-progress"
    )
      return;

    const next = [...guessedLetters, letter];
    const won = [...word].every((l) => next.includes(l));
    const wrong = next.filter((l) => !word.includes(l)).length;
    const lost = hardMode ? wrong >= 6 : wrong >= 11;

    setRound({
      guessedLetters: next,
      status: won ? "won" : lost ? "lost" : "in-progress",
    });
    if (won) {
      const scoreMultiplier =
        streak > 1
          ? (score + wordPoints(word, difficulty)) * streak
          : score + wordPoints(word, difficulty);
      setScore(scoreMultiplier);
      setStreak(streak + 1);
      setSuccess(true);
    }

    if (lost) {
      setFailed(true);
      setExtraLife(false);
    }

    if (lost && !activeSuperShield) {
      setStreak(0);
    }

    if (lost && lives > 0 && !activeShield && !activeSuperShield) {
      setLives(lives - 1);
    }

    if (won || lost) {
      setMatch({
        roundNumber: (match?.roundNumber ?? 0) + 1,
      });
    }
  };

  const roundOver = gameLost || gameWon;

  const shielded = activeShield || activeSuperShield;
  const dead = lives === 0;
  const failIcon = dead
    ? faSkullCrossbones
    : shielded
      ? faShieldHeart
      : faSkull;

  useEffect(() => {
    if (status === "in-progress" || lives === 0) return;
    const showLoading = setTimeout(() => {
      setLoading(true);
    }, 2000);
    const nextWord = setTimeout(() => {
      setRound({
        ...getWord(category, difficulty),
        guessedLetters: [],
        status: "in-progress",
      });
      if (failed) setActiveSuperShield(false);
      resetPowers();
      setLoading(false);
      setFailed(false);
      setSuccess(false);
    }, 4000);

    return () => {
      clearTimeout(showLoading);
      clearTimeout(nextWord);
    };
  }, [status, category, difficulty, lives]);

  const cancelPower = (power: string) => {
    const index = activePowers.indexOf(power);
    return activePowers.splice(index, 1);
  };

  useEffect(() => {
    if (!showShield) return;
    const hideShieldModal = setTimeout(() => {
      setShowShield(false);
    }, 3000);

    return () => {
      clearTimeout(hideShieldModal);
    };
  }, [showShield]);

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
                      extraLife && i === 0
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

      <Dialog open={showFeelingLucky}>
        <DialogTrigger
          disabled={score < rollCost}
          onClick={() => setShowFeelingLucky(true)}
          className="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md px-6 text-sm font-medium whitespace-nowrap transition-all outline-none hover:cursor-pointer focus-visible:ring-[3px] disabled:opacity-50 disabled:hover:cursor-not-allowed!"
        >
          Feeling Lucky <Badge>{rollCost} pts</Badge>
        </DialogTrigger>
        <DialogContent className="border-2 border-amber-400 px-8">
          <DialogHeader>
            <DialogTitle className="uppercase">Feeling Lucky?</DialogTitle>
            <DialogDescription className="py-2">
              Roll the dice to see what you get.
              {!executioner && " But you might get nothing at all."}
            </DialogDescription>
          </DialogHeader>
          {rolling ? (
            <div className="flex justify-center py-4 text-amber-400">
              <FontAwesomeIcon icon={faDice} size="5x" shake />
            </div>
          ) : luckyResult !== undefined ? (
            <div className="flex flex-col items-center justify-center gap-1.5 rounded-md border-2 border-amber-400 bg-amber-50 px-4 py-2">
              <p className="text-sm font-bold text-amber-400 uppercase">
                {luckyResult ? "You won" : "No luck"}
              </p>
              <p className="text-lg font-bold text-amber-500 uppercase">
                {luckyResult ?? "Better luck next time"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1.5 rounded-md border-2 border-amber-400 bg-amber-50 px-4 py-2 text-white">
              <p className="text-sm font-bold text-amber-400 uppercase">
                Cost to roll
              </p>
              <p className="text-lg font-bold text-amber-300 uppercase">
                {rollCost} pts
              </p>
              <span className="text-xs text-amber-400 uppercase">
                You have {score} to spend
              </span>
              {rollBlocked && (
                <span className="text-xs text-red-500">
                  Use your special power before rolling again
                </span>
              )}
            </div>
          )}
          <DialogFooter className="mt-2">
            <Button
              className="uppercase"
              variant="outline"
              onClick={closeFeelingLucky}
              disabled={rolling}
            >
              {luckyResult !== undefined ? "Close" : "Cancel"}
            </Button>
            {luckyResult === undefined && (
              <Button
                className="bg-amber-400 uppercase hover:bg-amber-500"
                onClick={feelingLucky}
                disabled={rolling || score < rollCost || rollBlocked}
              >
                Roll the dice
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
                onClick={() => guessedLetter(char)}
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
      <Dialog open={failed}>
        <DialogContent
          className="flex flex-col items-center justify-center gap-6 border-2 border-red-600 text-center"
          showCloseButton={false}
        >
          <DialogHeader
            className={cn(
              "flex flex-col items-center justify-center gap-4",
              shielded && !dead ? "text-blue-500" : "text-red-600",
            )}
          >
            <FontAwesomeIcon icon={failIcon} size="5x" />
            <DialogTitle className="uppercase">
              {shielded ? "Shield Activated" : "Hanged!"}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-black">
            The word was:{" "}
            <span className="uppercase underline underline-offset-3">
              {word}
            </span>
          </DialogDescription>
          {(dead || shielded) && (
            <p className="text-sm">
              {dead
                ? "You have died! Better luck next time."
                : shielded
                  ? "You were saved!"
                  : ""}
            </p>
          )}
          <DialogFooter className="flex flex-row items-center justify-center text-center text-xs">
            {dead ? (
              <Button size="lg" className="uppercase" onClick={endGame}>
                Main Menu
              </Button>
            ) : (
              loading && (
                <>
                  <Spinner />
                  <p>... Loading next word</p>
                </>
              )
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={success}>
        <DialogContent
          className="flex flex-col items-center justify-center gap-6 border-2 border-lime-600 text-center"
          showCloseButton={false}
        >
          <DialogHeader className="flex flex-col items-center justify-center gap-4 text-lime-600">
            <FontAwesomeIcon icon={faFaceGrinStars} size="5x" />
            <DialogTitle className="uppercase">You won!</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            You earned{" "}
            {streak > 1
              ? wordPoints(word, difficulty) * streak
              : wordPoints(word, difficulty)}{" "}
            points.
          </DialogDescription>
          {loading && (
            <DialogFooter className="flex flex-row items-center justify-center text-center text-xs">
              <Spinner />
              <span>... Loading next word</span>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isRevealed}>
        <DialogContent
          className="flex flex-col items-center justify-center gap-6 border-2 border-purple-600 text-center"
          showCloseButton={false}
        >
          <DialogHeader className="flex flex-col items-center justify-center gap-4 text-purple-600">
            <DialogTitle className="uppercase">Reveal a letter</DialogTitle>
            <p>Choose a position — that letter will be uncovered.</p>
          </DialogHeader>
          <DialogDescription>
            {[...word].map((char, i) => (
              <>
                {!guessedLetters.includes(char) && (
                  <div key={i} className="w-6">
                    <hr className={cn("border-b border-black")} />
                  </div>
                )}
              </>
            ))}
            <p className="uppercase">hidden positions</p>
            {[...word].map((char, i) => (
              <>
                {!guessedLetters.includes(char) && (
                  <Button
                    key={i}
                    className="w-6"
                    variant="outline"
                    onClick={() => {
                      setRound({ guessedLetters: [...guessedLetters, char] });
                      setIsRevealed(false);
                    }}
                  >
                    {i + 1}
                    {i === 0 ? "st" : "th"}
                  </Button>
                )}
              </>
            ))}
            <Button
              variant="outline"
              onClick={() => {
                cancelPower("Reveal");
                setIsRevealed(false);
              }}
            >
              Cancel Power
            </Button>
          </DialogDescription>
        </DialogContent>
      </Dialog>
      <Dialog open={showShield}>
        <DialogContent
          className="flex flex-col items-center justify-center gap-6 border-2 border-blue-400 text-center"
          showCloseButton={false}
        >
          <DialogHeader className="flex flex-col items-center justify-center gap-4 text-blue-400">
            <FontAwesomeIcon icon={faShield} size="5x" />
            <DialogTitle className="uppercase">Shield Activated</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            You have activated your shield. Protection awaits you.
          </DialogDescription>
        </DialogContent>
      </Dialog>
      <Dialog open={revivePower}>
        <DialogContent
          className="flex flex-col items-center justify-center gap-6 border-2 border-indigo-400 text-center"
          showCloseButton={false}
        >
          <DialogHeader className="flex flex-col items-center justify-center gap-4 text-indigo-400">
            <FontAwesomeIcon icon={faRepeat} size="5x" />
            <DialogTitle className="uppercase">
              Restore a used power
            </DialogTitle>
            <p className="text-center text-sm">
              You can only restore normal powers and not special ones you win
            </p>
          </DialogHeader>
          <DialogDescription>
            <div className="flex items-center justify-center gap-4">
              {activePowers.map((power) => (
                <Button
                  key={power}
                  variant="outline"
                  size="sm"
                  onClick={() => setRestorePower(power)}
                  activeBtn={restorePower === power}
                  className="uppercase"
                >
                  {power}
                </Button>
              ))}
            </div>
            <div className="mt-6 flex flex-col items-center justify-center gap-4">
              {restorePower && (
                <>
                  <p className="text-xs">
                    Are you sure you want to restore the power{" "}
                    <span className="font-bold uppercase">{restorePower}</span>?
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="secondary"
                      onClick={() => setRestorePower("")}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        setRevivePower(false);
                        setRestorePower("");
                        cancelPower(restorePower);
                      }}
                    >
                      Confirm
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
      <Dialog open={failedPower}>
        <DialogContent
          className={cn(
            "flex flex-col items-center justify-center gap-6 border-2 text-center",
            isPoisoned
              ? "border-green-700 dark:border-green-600"
              : "border-red-400",
          )}
          showCloseButton={false}
        >
          <DialogHeader
            className={cn(
              "flex flex-col items-center justify-center gap-4",
              isPoisoned
                ? "text-green-700 dark:text-green-600"
                : "text-red-400",
            )}
          >
            {isPoisoned ? (
              <FontAwesomeIcon icon={faSkull} size="5x" />
            ) : (
              <FontAwesomeIcon icon={faCircleXmark} size="5x" />
            )}
            <DialogTitle className="uppercase">
              {isPoisoned
                ? "Oh no! You've been poisoned!"
                : "Oh no! Your power failed"}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {isPoisoned
              ? "You will now loose a life due to the effects of being poisoned."
              : "Your power failed to activate. It's affects have not been applied. Hopefully it will work next time."}
          </DialogDescription>
          <DialogFooter>
            <Button
              onClick={() => setFailedPower(false)}
              variant="destructive"
              className={cn(isPoisoned && "bg-green-700!")}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
