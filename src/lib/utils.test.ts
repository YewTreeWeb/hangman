import { expect, test } from "bun:test";

import { useGameStore, useUserStore } from "@/store/gameStore";

import {
  revealWord,
  roundPoints,
  settleLoss,
  settleWin,
  wordPoints,
} from "./utils";

test("word points count unique letters times the level score", () => {
  expect(wordPoints("apple", "easy")).toBe(40);
  expect(wordPoints("apple", "hard")).toBe(120);
});

test("a streak above 1 multiplies the round's points, not the total score", () => {
  expect(roundPoints("apple", "easy", 0)).toBe(40);
  expect(roundPoints("apple", "easy", 1)).toBe(40);
  expect(roundPoints("apple", "easy", 3)).toBe(120);
});

const startRound = () => {
  useGameStore.setState({
    difficulty: "easy",
    round: {
      ...useGameStore.getState().round,
      word: "cat",
      guessedLetters: ["c"],
      status: "in-progress",
    },
  });
  useUserStore.setState({ score: 100, streak: 0, lives: 3, earned: 0 });
};

const user = () => useUserStore.getState();

test("settleWin adds the round's points plus any bonus and records them", () => {
  startRound();
  settleWin(1000);

  expect(user().score).toBe(1130);
  expect(user().earned).toBe(1030);
  expect(user().streak).toBe(1);
});

test("revealWord wins the current round and records the points", () => {
  startRound();
  revealWord(1000);

  expect(useGameStore.getState().round.status).toBe("won");
  expect(useGameStore.getState().round.guessedLetters.sort()).toEqual([
    "a",
    "c",
    "t",
  ]);
  expect(user().earned).toBe(1030);
});

test("a bomb loss takes every life unless a super shield is up", () => {
  startRound();
  settleLoss({ shield: true, superShield: false }, true);
  expect(user().lives).toBe(0);

  startRound();
  settleLoss({ shield: false, superShield: true }, true);
  expect(user().lives).toBe(3);
});

test("a normal loss takes one life unless shielded", () => {
  startRound();
  settleLoss({ shield: false, superShield: false });
  expect(user().lives).toBe(2);

  startRound();
  settleLoss({ shield: true, superShield: false });
  expect(user().lives).toBe(3);
});
