import { beforeEach, expect, test } from "bun:test";

import { fireEvent, render, screen } from "@testing-library/react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { useUserStore } from "@/store/gameStore";
import type { PowerTypes } from "@/types/game-types";

import { Powers } from "./powers";

const clue = (overrides: Partial<PowerTypes> = {}): PowerTypes => ({
  name: "Clue",
  description: "Provides a hint.",
  Icon: () => null,
  active: true,
  onUse: () => {},
  ...overrides,
});

const renderPower = (power: PowerTypes) =>
  render(
    <TooltipProvider>
      <Powers {...power} />
    </TooltipProvider>,
  );

const button = () => screen.getByRole("button", { name: /Clue/ });

beforeEach(() => useUserStore.setState({ activePowers: [], score: 0 }));

test("using a single-use power records it and disables the button", () => {
  let used = 0;

  renderPower(clue({ onUse: () => used++ }));
  fireEvent.click(button());

  expect(used).toBe(1);
  expect(useUserStore.getState().activePowers).toEqual(["Clue"]);
  expect(button().hasAttribute("disabled")).toBe(true);
});

test("multi-use powers stay enabled and show their uses", () => {
  renderPower(clue({ multiUse: true, uses: 2 }));
  fireEvent.click(button());

  expect(button().hasAttribute("disabled")).toBe(false);
  expect(screen.getByText("2")).toBeDefined();
});

test("inactive powers are disabled", () => {
  renderPower(clue({ active: false }));

  expect(button().hasAttribute("disabled")).toBe(true);
});

test("a locked power can't be unlocked without enough points", () => {
  useUserStore.setState({ score: 100 });
  renderPower(clue({ locked: true, toUnlock: 300 }));

  expect(button().hasAttribute("disabled")).toBe(true);
  expect(screen.queryByRole("button", { name: "Unlock Clue" })).toBeNull();
});

test("unlocking spends the cost and enables the power", () => {
  useUserStore.setState({ score: 500 });
  renderPower(clue({ locked: true, toUnlock: 300 }));

  fireEvent.click(screen.getByRole("button", { name: "Unlock Clue" }));

  expect(useUserStore.getState().score).toBe(200);
  expect(button().hasAttribute("disabled")).toBe(false);
});

test("locked powers default to a 250 point unlock", () => {
  useUserStore.setState({ score: 250 });
  renderPower(clue({ locked: true }));

  fireEvent.click(screen.getByRole("button", { name: "Unlock Clue" }));

  expect(useUserStore.getState().score).toBe(0);
});
