import { beforeEach, expect, jest, test } from "bun:test";

import { act, fireEvent, render, screen } from "@testing-library/react";

import { useUserStore } from "@/store/gameStore";
import type { PowerTypes } from "@/types/game-types";

import { FeelingLucky } from "./feelingLucky";

const zap: PowerTypes = {
  name: "Super Zap",
  description: "",
  Icon: () => null,
  active: true,
  onUse: () => {},
};

beforeEach(() => useUserStore.setState({ score: 1000 }));

test("rolling on executioner always wins and spends the cost", () => {
  jest.useFakeTimers();
  const won: string[] = [];

  render(
    <FeelingLucky
      difficulty="executioner"
      specialPowers={[zap]}
      rollBlocked={false}
      onWin={(name) => won.push(name)}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: /Feeling Lucky/ }));
  expect(screen.queryByText(/might get nothing/)).toBeNull();

  fireEvent.click(screen.getByRole("button", { name: "Roll the dice" }));
  expect(useUserStore.getState().score).toBe(0);

  act(() => jest.advanceTimersByTime(1500));
  expect(won).toEqual(["Super Zap"]);
  expect(screen.getByText("You won")).toBeDefined();

  fireEvent.click(screen.getByText("Close", { selector: "button" }));
  act(() => jest.advanceTimersByTime(1000));
  expect(screen.queryByText("You won")).toBeNull();
  jest.useRealTimers();
});

test("the dialog's X button closes it", () => {
  render(
    <FeelingLucky
      difficulty="easy"
      specialPowers={[zap]}
      rollBlocked={false}
      onWin={() => {}}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: /Feeling Lucky/ }));
  fireEvent.click(screen.getByRole("button", { name: "Close" }));

  expect(screen.queryByText("Roll the dice")).toBeNull();
});

test("a blocked roll explains why and can't be rolled", () => {
  render(
    <FeelingLucky
      difficulty="medium"
      specialPowers={[zap]}
      rollBlocked
      onWin={() => {}}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: /Feeling Lucky/ }));

  expect(screen.getByText(/might get nothing/)).toBeDefined();
  expect(
    screen.getByText("Use your special power before rolling again"),
  ).toBeDefined();
  expect(
    screen
      .getByRole("button", { name: "Roll the dice" })
      .hasAttribute("disabled"),
  ).toBe(true);
});

test("too few points disables the dialog trigger", () => {
  useUserStore.setState({ score: 100 });
  render(
    <FeelingLucky
      difficulty="easy"
      specialPowers={[zap]}
      rollBlocked={false}
      onWin={() => {}}
    />,
  );

  expect(
    screen
      .getByRole("button", { name: /Feeling Lucky/ })
      .hasAttribute("disabled"),
  ).toBe(true);
});
