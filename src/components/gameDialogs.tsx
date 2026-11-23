import {
  faBomb,
  faCircleXmark,
  faFaceGrinStars,
  faRepeat,
  faShield,
  faShieldHeart,
  faSkull,
  faSkullCrossbones,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

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
import { cn, endGame } from "@/lib/utils";

function LoadingNextWord() {
  return (
    <>
      <Spinner />
      <span>... Loading next word</span>
    </>
  );
}

type RoundLostDialogProps = {
  open: boolean;
  word: string;
  dead: boolean;
  // Lost to the bomb power rather than by guessing
  bombed?: boolean;
  shielded: boolean;
  loading: boolean;
};

// Death by the bomb shows Game Over; a shield that saved the player says so
const lostText = (dead: boolean, bombed: boolean, shielded: boolean) => {
  if (dead && bombed)
    return {
      saved: false,
      icon: faSkullCrossbones,
      title: "Game Over",
      message: "The bomb went off. Better luck next time.",
    };

  if (dead)
    return {
      saved: false,
      icon: faSkullCrossbones,
      title: "Hanged!",
      message: "You have died! Better luck next time.",
    };

  if (shielded)
    return {
      saved: true,
      icon: faShieldHeart,
      title: "Shield Activated",
      message: "You were saved!",
    };

  return { saved: false, icon: faSkull, title: "Hanged!", message: "" };
};

export function RoundLostDialog({
  open,
  word,
  dead,
  bombed = false,
  shielded,
  loading,
}: RoundLostDialogProps) {
  const text = lostText(dead, bombed, shielded);

  return (
    <Dialog open={open}>
      <DialogContent
        className="flex flex-col items-center justify-center gap-6 border-2 border-red-600 text-center"
        showCloseButton={false}
      >
        <DialogHeader
          className={cn(
            "flex flex-col items-center justify-center gap-4",
            text.saved ? "text-blue-500" : "text-red-600",
          )}
        >
          <FontAwesomeIcon icon={text.icon} size="5x" />
          <DialogTitle className="uppercase">{text.title}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-black">
          The word was:{" "}
          <span className="uppercase underline underline-offset-3">{word}</span>
        </DialogDescription>
        {text.message && <p className="text-sm">{text.message}</p>}
        <DialogFooter className="flex flex-row items-center justify-center text-center text-xs">
          {dead ? (
            <Button size="lg" className="uppercase" onClick={endGame}>
              Main Menu
            </Button>
          ) : (
            loading && <LoadingNextWord />
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type RoundWonDialogProps = { open: boolean; earned: number; loading: boolean };

export function RoundWonDialog({ open, earned, loading }: RoundWonDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent
        className="flex flex-col items-center justify-center gap-6 border-2 border-lime-600 text-center"
        showCloseButton={false}
      >
        <DialogHeader className="flex flex-col items-center justify-center gap-4 text-lime-600">
          <FontAwesomeIcon icon={faFaceGrinStars} size="5x" />
          <DialogTitle className="uppercase">You won!</DialogTitle>
        </DialogHeader>
        <DialogDescription>You earned {earned} points.</DialogDescription>
        {loading && (
          <DialogFooter className="flex flex-row items-center justify-center text-center text-xs">
            <LoadingNextWord />
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

const ordinal = (n: number) => {
  const suffix = { one: "st", two: "nd", few: "rd", other: "th" } as const;

  // SAFETY: ordinal PluralRules only returns the one, two, few and other categories for "en"
  const rule = new Intl.PluralRules("en", { type: "ordinal" }).select(
    n,
  ) as keyof typeof suffix;

  return `${n}${suffix[rule]}`;
};

type RevealDialogProps = {
  open: boolean;
  word: string;
  guessedLetters: string[];
  onReveal: (letter: string) => void;
  onCancel: () => void;
};

export function RevealDialog({
  open,
  word,
  guessedLetters,
  onReveal,
  onCancel,
}: RevealDialogProps) {
  const hidden = [...word].flatMap((char, i) =>
    guessedLetters.includes(char) ? [] : [{ char, position: i + 1 }],
  );

  return (
    <Dialog open={open}>
      <DialogContent
        className="flex flex-col items-center justify-center gap-6 border-2 border-purple-600 text-center"
        showCloseButton={false}
      >
        <DialogHeader className="flex flex-col items-center justify-center gap-4 text-purple-600">
          <DialogTitle className="uppercase">Reveal a letter</DialogTitle>
          <DialogDescription>
            Choose a position — that letter will be uncovered.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-2">
          {hidden.map(({ position }) => (
            <div key={position} className="w-6">
              <hr className="border-b border-black" />
            </div>
          ))}
          <p className="uppercase">hidden positions</p>
          {hidden.map(({ char, position }) => (
            <Button
              key={position}
              className="w-6"
              variant="outline"
              onClick={() => onReveal(char)}
            >
              {ordinal(position)}
            </Button>
          ))}
          <Button variant="outline" onClick={onCancel}>
            Cancel Power
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ShieldDialog({ open }: { open: boolean }) {
  return (
    <Dialog open={open}>
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
  );
}

type RevivalDialogProps = {
  open: boolean;
  usedPowers: string[];
  onRestore: (power: string) => void;
};

export function RevivalDialog({
  open,
  usedPowers,
  onRestore,
}: RevivalDialogProps) {
  const [restorePower, setRestorePower] = useState("");

  return (
    <Dialog open={open}>
      <DialogContent
        className="flex flex-col items-center justify-center gap-6 border-2 border-indigo-400 text-center"
        showCloseButton={false}
      >
        <DialogHeader className="flex flex-col items-center justify-center gap-4 text-indigo-400">
          <FontAwesomeIcon icon={faRepeat} size="5x" />
          <DialogTitle className="uppercase">Restore a used power</DialogTitle>
          <DialogDescription className="text-center text-sm">
            You can only restore normal powers and not special ones you win
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="flex items-center justify-center gap-4">
            {usedPowers.map((power) => (
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
                      onRestore(restorePower);
                      setRestorePower("");
                    }}
                  >
                    Confirm
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type FailedPowerDialogProps = {
  open: boolean;
  poisoned: boolean;
  onClose: () => void;
};

export function FailedPowerDialog({
  open,
  poisoned,
  onClose,
}: FailedPowerDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent
        className={cn(
          "flex flex-col items-center justify-center gap-6 border-2 text-center",
          poisoned
            ? "border-green-700 dark:border-green-600"
            : "border-red-400",
        )}
        showCloseButton={false}
      >
        <DialogHeader
          className={cn(
            "flex flex-col items-center justify-center gap-4",
            poisoned ? "text-green-700 dark:text-green-600" : "text-red-400",
          )}
        >
          <FontAwesomeIcon
            icon={poisoned ? faSkull : faCircleXmark}
            size="5x"
          />
          <DialogTitle className="uppercase">
            {poisoned
              ? "Oh no! You've been poisoned!"
              : "Oh no! Your power failed"}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {poisoned
            ? "You will now lose a life due to the effects of being poisoned."
            : "Your power failed to activate. Its effects have not been applied. Hopefully it will work next time."}
        </DialogDescription>
        <DialogFooter>
          <Button
            onClick={onClose}
            variant="destructive"
            className={cn(poisoned && "bg-green-700!")}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const COUNTDOWN_FROM = 3;

type BombStage = "confirm" | "countdown" | "result";

type BombDialogProps = {
  open: boolean;
  superShield: boolean;
  onCancel: () => void;
  onDetonate: (won: boolean) => void;
};

/**
 * Confirms the 50/50 risk, counts down 3... 2... 1... and explodes at 0.
 * The outcome is applied when the player continues from the result.
 */
export function BombDialog({
  open,
  superShield,
  onCancel,
  onDetonate,
}: BombDialogProps) {
  const [stage, setStage] = useState<BombStage>("confirm");
  const [count, setCount] = useState(COUNTDOWN_FROM);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (stage !== "countdown") return;

    const tick = setTimeout(() => {
      if (count > 1) return setCount(count - 1);

      setWon(Math.random() < 0.5);
      setStage("result");
    }, 1000);

    return () => clearTimeout(tick);
  }, [stage, count]);

  const reset = () => {
    setStage("confirm");
    setCount(COUNTDOWN_FROM);
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="flex flex-col items-center justify-center gap-6 border-2 border-orange-500 text-center"
        showCloseButton={false}
      >
        {stage === "confirm" && (
          <BombConfirm
            onCancel={() => {
              reset();
              onCancel();
            }}
            onAccept={() => setStage("countdown")}
          />
        )}
        {stage === "countdown" && <BombCountdown count={count} />}
        {stage === "result" && (
          <BombResult
            won={won}
            superShield={superShield}
            onContinue={() => {
              reset();
              onDetonate(won);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

type BombConfirmProps = { onCancel: () => void; onAccept: () => void };

function BombConfirm({ onCancel, onAccept }: BombConfirmProps) {
  return (
    <>
      <DialogHeader className="flex flex-col items-center justify-center gap-4 text-orange-500">
        <FontAwesomeIcon icon={faBomb} size="5x" />
        <DialogTitle className="uppercase">Light the fuse?</DialogTitle>
        <DialogDescription>
          The bomb has a 50/50 chance of winning or losing.
        </DialogDescription>
      </DialogHeader>
      <div className="grid w-full grid-cols-2 gap-4 text-sm">
        <div className="flex flex-col gap-2 rounded-md border-2 border-lime-600 bg-lime-50 p-4">
          <p className="font-bold text-lime-600 uppercase">If you win</p>
          <p>The word is revealed and the round is won.</p>
          <p>You get the word's points plus 1,000 bonus points.</p>
        </div>
        <div className="flex flex-col gap-2 rounded-md border-2 border-red-600 bg-red-50 p-4">
          <p className="font-bold text-red-600 uppercase">If you lose</p>
          <p>You lose every life and the game ends.</p>
          <p>Only a super shield can save you.</p>
        </div>
      </div>
      <DialogFooter className="flex w-full flex-row justify-center gap-4">
        <Button variant="outline" className="uppercase" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="bg-orange-500 uppercase hover:bg-orange-600"
          onClick={onAccept}
        >
          Accept
        </Button>
      </DialogFooter>
    </>
  );
}

function BombCountdown({ count }: { count: number }) {
  return (
    <DialogHeader className="flex flex-col items-center justify-center gap-4 text-orange-500">
      <FontAwesomeIcon icon={faBomb} size="5x" shake />
      <DialogTitle className="text-5xl font-bold" aria-live="assertive">
        {count}...
      </DialogTitle>
      <DialogDescription>The fuse is lit.</DialogDescription>
    </DialogHeader>
  );
}

type BombResultProps = {
  won: boolean;
  superShield: boolean;
  onContinue: () => void;
};

function BombResult({ won, superShield, onContinue }: BombResultProps) {
  return (
    <>
      <DialogHeader
        className={cn(
          "flex flex-col items-center justify-center gap-4",
          won ? "text-lime-600" : "text-red-600",
        )}
      >
        <FontAwesomeIcon icon={faBomb} size="5x" beatFade />
        <DialogTitle className="uppercase">
          {won ? "Boom! You won" : "Boom! You lost"}
        </DialogTitle>
        <DialogDescription>
          {won
            ? "The bomb blew the word wide open. 1,000 bonus points are yours."
            : superShield
              ? "Your super shield saved you from the blast."
              : "The blast caught you. Game over."}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button className="uppercase" onClick={onContinue}>
          Continue
        </Button>
      </DialogFooter>
    </>
  );
}
