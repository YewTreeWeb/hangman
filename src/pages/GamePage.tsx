import {
  faBolt,
  faFaceGrinStars,
  faForward,
  faHeart,
  faLightbulb,
  faMagnifyingGlass,
  faPhone,
  faShield,
  faSkull,
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
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { cn, getWord, wordPoints } from "@/lib/utils";
import { useGameStore, useUserStore } from "@/store/gameStore";
import type { PowerTypes } from "@/types/game-types";

export function GamePage() {
  const { category, difficulty, round, setRound, match, setMatch } =
    useGameStore();
  const { score, lives, setScore, streak, setStreak, setLives } =
    useUserStore();
  const [showClue, setShowClue] = useState<boolean>();
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeShield, setActiveShield] = useState(false);
  const [activeSuperShield, setActiveSuperShield] = useState(false);

  const { word, hint, guessedLetters, status } = round;
  console.log("🚀 ~ GamePage ~ guessedLetters:", guessedLetters);

  const resetPowers = () => {
    setShowClue(false);
    setActiveShield(false);
    setActiveSuperShield(false);
  };

  const powers: PowerTypes[] = [
    {
      name: "Clue",
      description: "Provides a hint for the current word.",
      Icon: () => <FontAwesomeIcon icon={faLightbulb} size="lg" />,
      multiUse: false,
      active: true,
      onUse: () => {
        setShowClue(true);
      },
    },
    {
      name: "Reveal",
      description: "Reveals a letter in the current word.",
      Icon: () => <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />,
      multiUse: false,
      active: true,
    },
    {
      name: "Shield",
      description: "Protects the player from one incorrect guess.",
      Icon: () => <FontAwesomeIcon icon={faShield} size="lg" />,
      multiUse: false,
      active: true,
      onUse: () => {
        setActiveShield(true);
      },
    },
    {
      name: "Skip",
      description: "Skips the current word.",
      Icon: () => <FontAwesomeIcon icon={faForward} size="lg" />,
      multiUse: false,
      active: true,
      onUse: () => {
        setRound({
          ...getWord(category, difficulty),
          guessedLetters: [],
          status: "in-progress",
        });
        resetPowers();
      },
    },
    {
      name: "Zap",
      description: "Removes five incorrect letters from the current word.",
      Icon: () => <FontAwesomeIcon icon={faBolt} size="lg" />,
      multiUse: false,
      active: false,
    },
    {
      name: "Phone a Friend",
      description: "Calls a random AI agent for help with the current word.",
      Icon: () => <FontAwesomeIcon icon={faPhone} size="lg" />,
      multiUse: false,
      active: true,
    },
  ];

  const kbdKeys = ["qwertyuiop", "asdfghjkl", "zxcvbnm"].map((row) => [...row]);

  const feelingLucky = () => {
    setScore(score - 250);
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

  const updateStreak = () => {};

  const hardMode = difficulty === "hard" || difficulty === "executioner";
  const gameLost =
    (hardMode && wrongLetter >= 6) || (!hardMode && wrongLetter >= 11);
  const gameWon = [...word].every((letter) => guessedLetters.includes(letter));

  const guessedLetter = (letter: string) => {
    if (guessedLetters.includes(letter) || status !== "in-progress") return;

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

    if (lost && !activeSuperShield) {
      setStreak(0);
    }

    if (lost && lives > 0 && !activeShield && !activeSuperShield) {
      setLives(lives - 1);
    }

    if (lost && lives === 0) {
      setFailed(true);
    }

    if (won || lost) {
      setMatch({
        roundNumber: (match?.roundNumber ?? 0) + 1,
      });
    }
  };

  const roundOver = gameLost || gameWon;

  useEffect(() => {
    if (status === "in-progress") return;
    const showLoading = setTimeout(() => {
      setLoading(true);
    }, 2000);
    const nextWord = setTimeout(() => {
      setRound({
        ...getWord(category, difficulty),
        guessedLetters: [],
        status: "in-progress",
      });
      resetPowers();
      setActiveSuperShield(false);
      setLoading(false);
      setFailed(false);
      setSuccess(false);
    }, 4000);

    return () => {
      clearTimeout(showLoading);
      clearTimeout(nextWord);
    };
  }, [status, category, difficulty]);

  return (
    <div className="relative z-10 mx-auto flex w-dvh flex-col gap-4 p-4 text-center">
      <div className="flex flex-col items-center justify-center gap-8">
        <HeaderMenu />
        <div className="flex w-full flex-row items-center justify-between gap-2">
          <div className="flex flex-col gap-1 text-sm">
            <span>Score</span>
            <span className="text-lg font-bold">{score}</span>
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
                    ? "text-amber-400"
                    : "text-red-400",
              )}
            >
              {Array.from({ length: lives }, (_, i) => (
                <span key={i}>
                  <FontAwesomeIcon icon={faHeart} size="lg" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <section className="grid grid-cols-2 items-center justify-center gap-14">
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
        <div className="flex items-center justify-center gap-4">
          <h5 className="text-xs uppercase">Powers</h5>
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
      <section className="flex flex-col items-center justify-center gap-1">
        {kbdKeys.map((kdb, i) => (
          <div key={kdb[i]} className="flex items-center justify-center gap-1">
            {kdb.map((char, i) => (
              <Button
                key={i}
                variant="outline"
                className="uppercase"
                onClick={() => {
                  setRound({
                    guessedLetters: [...guessedLetters, char],
                  });
                  guessedLetter(char);
                }}
                disabled={guessedLetters.includes(char) || gameLost || gameWon}
              >
                {char}
              </Button>
            ))}
          </div>
        ))}
      </section>
      <section>
        <div
          className={cn(
            "flex gap-x-2",
            activeSuperShield ? "text-amber-400" : "text-black",
          )}
        >
          <span>Streak</span>
          <span>{streak}</span>
        </div>
      </section>
      <Dialog open={failed}>
        <DialogContent
          className="flex flex-col items-center justify-center gap-6 text-center"
          showCloseButton={false}
        >
          <DialogHeader className="flex flex-col items-center justify-center gap-4 text-red-600">
            <FontAwesomeIcon icon={faSkull} size="5x" />
            <DialogTitle className="uppercase">Hanged!</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-black">
            The word was:{" "}
            <span className="uppercase underline underline-offset-3">
              {word}
            </span>
          </DialogDescription>
          {loading && (
            <DialogFooter className="flex flex-row items-center justify-center text-center text-xs">
              <Spinner />
              <span>... Loading next word</span>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={success}>
        <DialogContent
          className="flex flex-col items-center justify-center gap-6 text-center"
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
    </div>
  );
}
