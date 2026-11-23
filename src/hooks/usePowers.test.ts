import { afterEach, beforeEach, expect, mock, spyOn, test } from "bun:test";

import { act, renderHook } from "@testing-library/react";

import { useGameStore, useUserStore } from "@/store/gameStore";

import { usePowers } from "./usePowers";

const special = (
  result: { current: ReturnType<typeof usePowers> },
  name: string,
) => {
  const power = result.current.specialPowers.find((p) => p.name === name);

  if (!power) throw new Error(`No special power named ${name}`);

  return power;
};

beforeEach(() => {
  useGameStore.setState({ unlockPowers: false });
  useUserStore.setState({ lives: 2, streak: 0, activePowers: [] });
});

afterEach(() => mock.restore());

test("blue potion heals one life on easy", () => {
  const { result } = renderHook(() => usePowers("easy"));

  act(() => special(result, "Blue Potion").onUse());

  expect(useUserStore.getState().lives).toBe(3);
  expect(result.current.failedPower).toBe(false);
});

test("red potion adds two lives and marks the extra life", () => {
  const { result } = renderHook(() => usePowers("medium"));

  act(() => special(result, "Red Potion").onUse());

  expect(useUserStore.getState().lives).toBe(4);
  expect(result.current.extraLife).toBe(true);
});

test("potions can fail on hard levels", () => {
  spyOn(Math, "random").mockReturnValue(0);
  const { result } = renderHook(() => usePowers("hard"));

  act(() => special(result, "Blue Potion").onUse());

  expect(useUserStore.getState().lives).toBe(2);
  expect(result.current.failedPower).toBe(true);

  act(() => result.current.closeFailedPower());
  expect(result.current.failedPower).toBe(false);
});

test("a failed red potion poisons the player", () => {
  spyOn(Math, "random").mockReturnValue(0);
  const { result } = renderHook(() => usePowers("hard"));

  act(() => special(result, "Red Potion").onUse());

  expect(result.current.poisoned).toBe(true);
  expect(result.current.failedPower).toBe(true);
});

test("revival opens the restore dialog and frees the chosen power", () => {
  useUserStore.setState({ activePowers: ["Clue", "Skip"] });
  const { result } = renderHook(() => usePowers("easy"));

  act(() => special(result, "Revival").onUse());
  expect(result.current.reviving).toBe(true);

  act(() => result.current.reviveUsedPower("Clue"));
  expect(result.current.reviving).toBe(false);
  expect(useUserStore.getState().activePowers).toEqual(["Skip"]);
});

test("the first magic star unlocks powers, the next keeps the hint shown", () => {
  useGameStore.setState({ difficulty: "easy" });
  const { result } = renderHook(() => usePowers("easy"));

  act(() => special(result, "Magic Star").onUse());
  expect(useGameStore.getState().unlockPowers).toBe(true);
  expect(result.current.alwaysShowClue).toBe(false);
  expect(useUserStore.getState().streak).toBe(50);

  act(() => special(result, "Magic Star").onUse());
  expect(result.current.alwaysShowClue).toBe(true);
  expect(result.current.showClue).toBe(true);
  expect(useGameStore.getState().round.status).toBe("won");
  expect(useUserStore.getState().streak).toBe(100);
});

test("a super shield survives a won round but not a lost one", () => {
  const { result } = renderHook(() => usePowers("easy"));

  act(() => special(result, "Super Shield").onUse());
  expect(result.current.shieldKind).toBe("super");

  act(() => result.current.resetPowers(false));
  expect(result.current.shieldKind).toBe("super");

  act(() => result.current.resetPowers(true));
  expect(result.current.shieldKind).toBe("none");
});

test("cancelling a reveal frees the Reveal power", () => {
  useUserStore.setState({ activePowers: ["Reveal"] });
  const { result } = renderHook(() => usePowers("easy"));

  act(() => result.current.cancelReveal());

  expect(useUserStore.getState().activePowers).toEqual([]);
});

test("special powers won are spent on use", () => {
  const { result } = renderHook(() => usePowers("executioner"));

  act(() => result.current.addWonPower("Super Zap", 1));
  expect(result.current.rollBlocked).toBe(true);

  act(() => result.current.useSpecialPower(special(result, "Super Zap")));
  expect(result.current.wonPowers["Super Zap"]).toBe(0);
  expect(result.current.zapped).toHaveLength(10);
  expect(result.current.rollBlocked).toBe(false);
});

const startBombRound = () => {
  useGameStore.setState({
    difficulty: "easy",
    round: {
      ...useGameStore.getState().round,
      word: "cat",
      guessedLetters: [],
      status: "in-progress",
    },
  });
  useUserStore.setState({
    score: 0,
    streak: 2,
    lives: 3,
    activePowers: ["Bomb"],
  });
};

test("cancelling the bomb gives it back", () => {
  startBombRound();
  const { result } = renderHook(() => usePowers("easy"));

  act(() => special(result, "Bomb").onUse());
  expect(result.current.bombArmed).toBe(true);

  act(() => result.current.cancelBomb());

  expect(result.current.bombArmed).toBe(false);
  expect(result.current.wonPowers.Bomb).toBe(1);
  expect(useUserStore.getState().activePowers).toEqual([]);
});

test("a winning bomb reveals the word with 1,000 bonus points", () => {
  startBombRound();
  const { result } = renderHook(() => usePowers("easy"));

  act(() => result.current.detonateBomb(true));

  expect(useGameStore.getState().round.status).toBe("won");
  expect(useUserStore.getState().score).toBe(1060);
  expect(useUserStore.getState().streak).toBe(2);
});

test("a losing bomb takes every life and loses the round", () => {
  startBombRound();
  const { result } = renderHook(() => usePowers("easy"));

  act(() => result.current.detonateBomb(false));

  expect(useUserStore.getState().lives).toBe(0);
  expect(useGameStore.getState().round.status).toBe("lost");
  expect(result.current.bombed).toBe(true);
});

test("a super shield survives a losing bomb", () => {
  startBombRound();
  useGameStore.setState({ page: "game" });
  const { result } = renderHook(() => usePowers("easy"));

  act(() => special(result, "Super Shield").onUse());
  act(() => result.current.detonateBomb(false));

  expect(useUserStore.getState().lives).toBe(3);
  expect(useGameStore.getState().round.status).toBe("in-progress");
  expect(result.current.bombed).toBe(false);
});
