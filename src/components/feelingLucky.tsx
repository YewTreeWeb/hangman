import { faDice } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

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
import { rollCost, rollSpecialPower } from "@/lib/feelingLucky";
import { useUserStore } from "@/store/gameStore";
import type { LevelKey, PowerTypes } from "@/types/game-types";

type FeelingLuckyProps = {
  difficulty: LevelKey;
  specialPowers: PowerTypes[];
  rollBlocked: boolean;
  onWin: (name: string) => void;
};

export function FeelingLucky({
  difficulty,
  specialPowers,
  rollBlocked,
  onWin,
}: FeelingLuckyProps) {
  const { score, setScore } = useUserStore();
  const [open, setOpen] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<string | null>();

  const cost = rollCost(difficulty);
  const rolled = result !== undefined;

  const roll = () => {
    setScore(score - cost);
    setRolling(true);

    setTimeout(() => {
      const name = rollSpecialPower(specialPowers, difficulty);

      if (name) onWin(name);

      setResult(name);
      setRolling(false);
    }, 1500);
  };

  const close = () => {
    setOpen(false);
    // Clear after the close animation so the result doesn't flash back to the cost
    setTimeout(() => setResult(undefined), 1000);
  };

  return (
    <Dialog open={open}>
      <DialogTrigger
        disabled={score < cost}
        onClick={() => setOpen(true)}
        className="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md px-6 text-sm font-medium whitespace-nowrap transition-all outline-none hover:cursor-pointer focus-visible:ring-[3px] disabled:opacity-50 disabled:hover:cursor-not-allowed!"
      >
        Feeling Lucky <Badge>{cost} pts</Badge>
      </DialogTrigger>
      <DialogContent className="border-2 border-amber-400 px-8">
        <DialogHeader>
          <DialogTitle className="uppercase">Feeling Lucky?</DialogTitle>
          <DialogDescription className="py-2">
            Roll the dice to see what you get.
            {difficulty !== "executioner" &&
              " But you might get nothing at all."}
          </DialogDescription>
        </DialogHeader>
        {rolling ? (
          <div className="flex justify-center py-4 text-amber-400">
            <FontAwesomeIcon icon={faDice} size="5x" shake />
          </div>
        ) : rolled ? (
          <RollResult name={result} />
        ) : (
          <RollCost cost={cost} score={score} rollBlocked={rollBlocked} />
        )}
        <DialogFooter className="mt-2">
          <Button
            className="uppercase"
            variant="outline"
            onClick={close}
            disabled={rolling}
          >
            {rolled ? "Close" : "Cancel"}
          </Button>
          {!rolled && (
            <Button
              className="bg-amber-400 uppercase hover:bg-amber-500"
              onClick={roll}
              disabled={rolling || score < cost || rollBlocked}
            >
              Roll the dice
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RollResult({ name }: { name: string | null }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 rounded-md border-2 border-amber-400 bg-amber-50 px-4 py-2">
      <p className="text-sm font-bold text-amber-400 uppercase">
        {name ? "You won" : "No luck"}
      </p>
      <p className="text-lg font-bold text-amber-500 uppercase">
        {name ?? "Better luck next time"}
      </p>
    </div>
  );
}

type RollCostProps = { cost: number; score: number; rollBlocked: boolean };

function RollCost({ cost, score, rollBlocked }: RollCostProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 rounded-md border-2 border-amber-400 bg-amber-50 px-4 py-2 text-white">
      <p className="text-sm font-bold text-amber-400 uppercase">Cost to roll</p>
      <p className="text-lg font-bold text-amber-300 uppercase">{cost} pts</p>
      <span className="text-xs text-amber-400 uppercase">
        You have {score} to spend
      </span>
      {rollBlocked && (
        <span className="text-xs text-red-500">
          Use your special power before rolling again
        </span>
      )}
    </div>
  );
}
