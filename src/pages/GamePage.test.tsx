import { beforeEach, expect, jest, test } from "bun:test";

import { act, fireEvent, render, screen } from "@testing-library/react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { useGameStore, useUserStore } from "@/store/gameStore";

import { GamePage } from "./GamePage";

beforeEach(() => {
  useGameStore.setState({
    category: "Animals",
    unlockPowers: false,
    round: {
      ...useGameStore.getState().round,
      word: "cat",
      hint: "Purrs",
      guessedLetters: [],
      status: "in-progress",
    },
  });
  useUserStore.setState({ score: 0, streak: 0, lives: 3, activePowers: [] });
});

const renderGame = () =>
  render(
    <TooltipProvider>
      <GamePage difficulty="easy" />
    </TooltipProvider>,
  );

const press = (letter: string) =>
  fireEvent.click(screen.getByRole("button", { name: letter }));

test("winning a round scores it and loads the next word", () => {
  jest.useFakeTimers();
  renderGame();

  expect(screen.getByText("Worth 30 points")).toBeDefined();

  for (const letter of "cat") press(letter);

  expect(screen.getByText("You won!")).toBeDefined();
  expect(screen.getByText("You earned 30 points.")).toBeDefined();
  expect(useUserStore.getState().score).toBe(30);

  act(() => jest.advanceTimersByTime(4000));
  expect(useGameStore.getState().round.status).toBe("in-progress");
  expect(useGameStore.getState().round.guessedLetters).toEqual([]);
  jest.useRealTimers();
});

test("losing a round shows the word and costs a life", () => {
  renderGame();

  for (const letter of "bdefghijklm") press(letter);

  expect(screen.getByText("Hanged!")).toBeDefined();
  expect(useUserStore.getState().lives).toBe(2);
});

test("the clue power shows the hint", () => {
  renderGame();

  expect(screen.queryByText("Purrs")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: /Clue/ }));
  expect(screen.getByText("Purrs")).toBeDefined();
});

test("the shield power shows its dialog and saves a life", () => {
  jest.useFakeTimers();
  renderGame();

  fireEvent.click(screen.getByRole("button", { name: /Shield/ }));
  expect(
    screen.getByText("You have activated your shield. Protection awaits you."),
  ).toBeDefined();

  act(() => jest.advanceTimersByTime(3000));

  for (const letter of "bdefghijklm") press(letter);

  expect(screen.getByText("You were saved!")).toBeDefined();
  expect(useUserStore.getState().lives).toBe(3);
  jest.useRealTimers();
});
