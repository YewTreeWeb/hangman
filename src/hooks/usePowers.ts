import { useState } from "react";

import type { ShieldKind } from "@/components/gameBoard";
import { useAutoClose } from "@/hooks/useRoundTimers";
import { pickZapped } from "@/lib/guess";
import { getPowers, getSpecialPowers } from "@/lib/powerList";
import { getWord } from "@/lib/utils";
import { useGameStore, useUserStore } from "@/store/gameStore";
import type { LevelKey, PowerTypes } from "@/types/game-types";

const MAX_LIVES = 3;

const shieldKindOf = (shield: boolean, superShield: boolean): ShieldKind => {
  if (shield) return "shield";

  return superShield ? "super" : "none";
};

/**
 * Power state for one game: what each normal and special power does when
 * used, the shields and zapped letters guessing depends on, and the dialogs
 * powers open. `revealWord` is called by the Magic Star.
 */
export function usePowers(difficulty: LevelKey, revealWord: () => void) {
  const { category, round, setRound, unlockPowers, setUnlockPowers } =
    useGameStore();

  const { lives, streak, setStreak, activePowers, cancelPower } =
    useUserStore();

  const [showClue, setShowClue] = useState(false);
  const [alwaysShowClue, setAlwaysShowClue] = useState(false);
  const [shield, setShield] = useState(false);
  const [superShield, setSuperShield] = useState(false);
  const [showShield, setShowShield] = useState(false);
  const [zapped, setZapped] = useState<string[]>([]);
  const [revealing, setRevealing] = useState(false);
  const [wonPowers, setWonPowers] = useState<Record<string, number>>({});

  useAutoClose(showShield, () => setShowShield(false), 3000);

  const risky = useRiskyPowers(
    difficulty === "hard" || difficulty === "executioner",
  );

  const zappedLetters = (amount: number) =>
    setZapped(pickZapped(round.word, round.guessedLetters, amount));

  const raiseShield = (activate: (on: boolean) => void) => {
    activate(true);
    setShowShield(true);
  };

  // Clears per-round effects; a super shield survives a won round
  const resetPowers = (lost: boolean) => {
    setShowClue(alwaysShowClue);
    setSuperShield(superShield && !lost);
    setShield(false);
    risky.reset();
    setZapped([]);
  };

  const skip = () =>
    setTimeout(() => {
      setRound({
        ...getWord(category, difficulty),
        guessedLetters: [],
        status: "in-progress",
      });
      resetPowers(false);
    }, 1000);

  // The first star unlocks powers; later stars keep the hint on screen
  const magicStar = () => {
    setStreak(streak + 50);
    setUnlockPowers(true);
    setAlwaysShowClue(alwaysShowClue || !!unlockPowers);
    setShowClue(showClue || !!unlockPowers);
    revealWord();
  };

  const state = {
    lives,
    usedPowers: activePowers,
    unlockPowers: !!unlockPowers,
  };

  const powers = getPowers(
    {
      clue: () => setShowClue(true),
      reveal: () => setRevealing(true),
      shield: () => raiseShield(setShield),
      skip,
      zap: () => zappedLetters(5),
    },
    difficulty,
    state,
  );

  const specialPowers = getSpecialPowers(
    {
      potion: risky.bluePotion,
      redPotion: risky.redPotion,
      revival: risky.revival,
      superZap: () => zappedLetters(10),
      superShield: () => raiseShield(setSuperShield),
      bernardsWatch: () => {},
      magicStar,
    },
    difficulty,
    state,
  );

  const addWonPower = (name: string, change: number) =>
    setWonPowers((prev) => ({ ...prev, [name]: (prev[name] ?? 0) + change }));

  return {
    powers,
    specialPowers,
    wonPowers,
    addWonPower,
    useSpecialPower: (power: PowerTypes) => {
      addWonPower(power.name, -1);
      power.onUse();
    },
    // executioner can only hold one special power at a time
    rollBlocked:
      difficulty === "executioner" &&
      Object.values(wonPowers).some((count) => count > 0),
    shields: { shield, superShield },
    shieldKind: shieldKindOf(shield, superShield),
    zapped,
    showClue,
    alwaysShowClue,
    showShield,
    extraLife: risky.extraLife,
    poisoned: risky.poisoned,
    failedPower: risky.failedPower,
    closeFailedPower: risky.closeFailedPower,
    revealing,
    finishReveal: () => setRevealing(false),
    cancelReveal: () => {
      cancelPower("Reveal");
      setRevealing(false);
    },
    reviving: risky.reviving,
    reviveUsedPower: (power: string) => {
      risky.stopReviving();
      cancelPower(power);
    },
    resetPowers,
  };
}

/**
 * Potions and Revival. On hard levels each has a chance to fail, and a red
 * potion can poison the player instead of healing.
 */
function useRiskyPowers(hardMode: boolean) {
  const { lives, setLives } = useUserStore();

  const [reviving, setReviving] = useState(false);
  const [extraLife, setExtraLife] = useState(false);
  const [poisoned, setPoisoned] = useState(false);
  const [failedPower, setFailedPower] = useState(false);

  const sideEffect = (chance: number) => hardMode && Math.random() < chance;
  const canHeal = lives > 0 && lives < MAX_LIVES;

  const poison = () => {
    setPoisoned(true);
    setFailedPower(true);
    setTimeout(() => {
      setLives(lives - 1);
      setPoisoned(false);
    }, 1000);
  };

  return {
    reviving,
    extraLife,
    poisoned,
    failedPower,
    closeFailedPower: () => setFailedPower(false),
    stopReviving: () => setReviving(false),
    reset: () => {
      setExtraLife(false);
      setReviving(false);
    },
    bluePotion: () => {
      if (sideEffect(0.1)) return setFailedPower(true);

      if (canHeal) setLives(lives + 1);
    },
    redPotion: () => {
      if (sideEffect(0.1)) return poison();

      if (canHeal) setLives(lives + 2);

      setExtraLife(true);
    },
    revival: () => (sideEffect(0.2) ? setFailedPower(true) : setReviving(true)),
  };
}
