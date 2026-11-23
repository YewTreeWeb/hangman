import { expect, test } from "bun:test";

import { fireEvent, render, screen } from "@testing-library/react";

import {
  FailedPowerDialog,
  RevealDialog,
  RevivalDialog,
  RoundLostDialog,
  RoundWonDialog,
  ShieldDialog,
} from "./gameDialogs";

test("lost dialog shows the word and the loading spinner", () => {
  render(
    <RoundLostDialog open word="cat" dead={false} shielded={false} loading />,
  );

  expect(screen.getByText("Hanged!")).toBeDefined();
  expect(screen.getByText("cat")).toBeDefined();
  expect(screen.getByText("... Loading next word")).toBeDefined();
});

test("a shield saves the player", () => {
  render(
    <RoundLostDialog open word="cat" dead={false} shielded loading={false} />,
  );

  expect(screen.getByText("Shield Activated")).toBeDefined();
  expect(screen.getByText("You were saved!")).toBeDefined();
});

test("dying offers the main menu", () => {
  render(<RoundLostDialog open word="cat" dead shielded={false} loading />);

  expect(
    screen.getByText("You have died! Better luck next time."),
  ).toBeDefined();
  expect(screen.getByRole("button", { name: "Main Menu" })).toBeDefined();
  expect(screen.queryByText("... Loading next word")).toBeNull();
});

test("won dialog shows the points earned", () => {
  render(<RoundWonDialog open earned={120} loading={false} />);

  expect(screen.getByText("You earned 120 points.")).toBeDefined();
});

test("reveal lists hidden positions with ordinals", () => {
  const revealed: string[] = [];

  render(
    <RevealDialog
      open
      word="cats"
      guessedLetters={["c"]}
      onReveal={(letter) => revealed.push(letter)}
      onCancel={() => {}}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "3rd" }));

  expect(screen.getByRole("button", { name: "2nd" })).toBeDefined();
  expect(screen.queryByRole("button", { name: "1st" })).toBeNull();
  expect(revealed).toEqual(["t"]);
});

test("failed power dialog explains poisoning", () => {
  let closed = false;

  render(<FailedPowerDialog open poisoned onClose={() => (closed = true)} />);
  fireEvent.click(screen.getByRole("button", { name: "Close" }));

  expect(screen.getByText("Oh no! You've been poisoned!")).toBeDefined();
  expect(closed).toBe(true);
});

test("failed power dialog without poison", () => {
  render(<FailedPowerDialog open poisoned={false} onClose={() => {}} />);

  expect(screen.getByText("Oh no! Your power failed")).toBeDefined();
});

test("revival restores the confirmed power", () => {
  const restored: string[] = [];

  render(
    <RevivalDialog
      open
      usedPowers={["Clue", "Skip"]}
      onRestore={(power) => restored.push(power)}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Skip" }));
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(screen.queryByRole("button", { name: "Confirm" })).toBeNull();

  fireEvent.click(screen.getByRole("button", { name: "Clue" }));
  fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

  expect(restored).toEqual(["Clue"]);
});

test("shield dialog", () => {
  render(<ShieldDialog open />);

  expect(screen.getByText("Shield Activated")).toBeDefined();
});
