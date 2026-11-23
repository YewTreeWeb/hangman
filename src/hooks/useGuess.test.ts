import { beforeEach, expect, test } from "bun:test";

import { act, fireEvent, renderHook } from "@testing-library/react";

import { useGameStore, useUserStore } from "@/store/gameStore";

import { useGuess } from "./useGuess";

const noShields = { shield: false, superShield: false };

const startRound = (word: string) => {
  useGameStore.setState({
    difficulty: "easy",
    round: {
      ...useGameStore.getState().round,
      word,
      guessedLetters: [],
      status: "in-progress",
    },
    match: { ...useGameStore.getState().match, roundNumber: 1 },
  });
  useUserStore.setState({ score: 0, streak: 0, lives: 3 });
};

const round = () => useGameStore.getState().round;
const user = () => useUserStore.getState();

beforeEach(() => startRound("cat"));

test("guessing every letter wins and scores the word", () => {
  const { result } = renderHook(() => useGuess("easy", [], noShields));

  for (const letter of "cat") act(() => result.current.guessedLetter(letter));

  expect(round().status).toBe("won");
  expect(user().score).toBe(30);
  expect(user().streak).toBe(1);
  expect(user().earned).toBe(30);
  expect(useGameStore.getState().match.roundNumber).toBe(2);
});

test("repeat, zapped and post-round guesses are ignored", () => {
  const { result } = renderHook(() => useGuess("easy", ["z"], noShields));

  act(() => result.current.guessedLetter("c"));
  act(() => result.current.guessedLetter("c"));
  act(() => result.current.guessedLetter("z"));

  expect(round().guessedLetters).toEqual(["c"]);
});

test("losing costs a life and resets the streak", () => {
  useUserStore.setState({ streak: 4 });
  const { result } = renderHook(() => useGuess("hard", [], noShields));

  for (const letter of "bdefgh")
    act(() => result.current.guessedLetter(letter));

  expect(round().status).toBe("lost");
  expect(user().lives).toBe(2);
  expect(user().streak).toBe(0);
});

test("a shield keeps the life but not the streak", () => {
  useUserStore.setState({ streak: 4 });

  const { result } = renderHook(() =>
    useGuess("hard", [], { shield: true, superShield: false }),
  );

  for (const letter of "bdefgh")
    act(() => result.current.guessedLetter(letter));

  expect(user().lives).toBe(3);
  expect(user().streak).toBe(0);
});

test("a super shield keeps both the life and the streak", () => {
  useUserStore.setState({ streak: 4 });

  const { result } = renderHook(() =>
    useGuess("hard", [], { shield: false, superShield: true }),
  );

  for (const letter of "bdefgh")
    act(() => result.current.guessedLetter(letter));

  expect(user().lives).toBe(3);
  expect(user().streak).toBe(4);
});

test("letter keys guess and other keys are ignored", () => {
  renderHook(() => useGuess("easy", [], noShields));

  act(() => {
    fireEvent.keyPress(document, { key: "c", charCode: 99 });
    fireEvent.keyPress(document, { key: "1", charCode: 49 });
  });

  expect(round().guessedLetters).toEqual(["c"]);
});
