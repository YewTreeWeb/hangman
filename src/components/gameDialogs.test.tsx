import { afterEach, describe, expect, jest, mock, spyOn, test } from "bun:test";

import { act, fireEvent, render, screen } from "@testing-library/react";

import {
  BombDialog,
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

test("a bomb loss shows Game Over with the main menu", () => {
  render(
    <RoundLostDialog open word="cat" dead bombed shielded={false} loading />,
  );

  expect(screen.getByText("Game Over")).toBeDefined();
  expect(screen.queryByText("Hanged!")).toBeNull();
  expect(
    screen.getByText("The bomb went off. Better luck next time."),
  ).toBeDefined();
  expect(screen.getByRole("button", { name: "Main Menu" })).toBeDefined();
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

describe("bomb dialog", () => {
  afterEach(() => {
    mock.restore();
    jest.useRealTimers();
  });

  const press = (name: string) =>
    fireEvent.click(screen.getByRole("button", { name }));

  const renderBomb = (superShield: boolean, results: boolean[] = []) =>
    render(
      <BombDialog
        open
        superShield={superShield}
        onCancel={() => results.push(false)}
        onDetonate={(won) => results.push(won)}
      />,
    );

  const countDown = () => {
    for (let tick = 0; tick < 3; tick++)
      act(() => jest.advanceTimersByTime(1000));
  };

  test("explains both outcomes side by side", () => {
    renderBomb(false);

    expect(screen.getByText(/50\/50 chance/)).toBeDefined();
    expect(screen.getByText("If you win")).toBeDefined();
    expect(screen.getByText("If you lose")).toBeDefined();
    expect(screen.getByText("Only a super shield can save you.")).toBeDefined();
  });

  test("cancel reports back without counting down", () => {
    let cancelled = false;

    render(
      <BombDialog
        open
        superShield={false}
        onCancel={() => (cancelled = true)}
        onDetonate={() => {}}
      />,
    );
    press("Cancel");

    expect(cancelled).toBe(true);
  });

  test("accepting counts down 3, 2, 1 then explodes", () => {
    jest.useFakeTimers();
    spyOn(Math, "random").mockReturnValue(0.2);
    const results: boolean[] = [];

    renderBomb(false, results);
    press("Accept");

    expect(screen.getByText("3...")).toBeDefined();
    act(() => jest.advanceTimersByTime(1000));
    expect(screen.getByText("2...")).toBeDefined();
    act(() => jest.advanceTimersByTime(1000));
    expect(screen.getByText("1...")).toBeDefined();
    act(() => jest.advanceTimersByTime(1000));

    expect(screen.getByText("Boom! You won")).toBeDefined();
    expect(results).toEqual([]);

    press("Continue");
    expect(results).toEqual([true]);
  });

  test("a high roll loses and ends the game", () => {
    jest.useFakeTimers();
    spyOn(Math, "random").mockReturnValue(0.7);
    const results: boolean[] = [];

    renderBomb(false, results);
    press("Accept");
    countDown();

    expect(screen.getByText("Boom! You lost")).toBeDefined();
    expect(screen.getByText("The blast caught you. Game over.")).toBeDefined();
    press("Continue");
    expect(results).toEqual([false]);
  });

  test("a super shield survives a lost bomb", () => {
    jest.useFakeTimers();
    spyOn(Math, "random").mockReturnValue(0.7);

    renderBomb(true);
    press("Accept");
    countDown();

    expect(
      screen.getByText("Your super shield saved you from the blast."),
    ).toBeDefined();
  });
});
