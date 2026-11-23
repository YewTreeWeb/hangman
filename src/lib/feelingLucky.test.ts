import { expect, test } from "bun:test";

import type { PowerTypes } from "@/types/game-types";

import { rollCost, rollSpecialPower } from "./feelingLucky";

const power = (name: string, weight?: number): PowerTypes => ({
  name,
  description: "",
  Icon: () => null,
  active: true,
  onUse: () => {},
  weight,
});

const powers = [power("Potion"), power("Star", 2)];

test("roll cost depends on difficulty", () => {
  expect(rollCost("easy")).toBe(250);
  expect(rollCost("medium")).toBe(500);
  expect(rollCost("hard")).toBe(500);
  expect(rollCost("executioner")).toBe(1000);
});

test("weights decide which power a roll lands on", () => {
  // total weight on easy is 10 + 2 + 10 (nothing) = 22
  expect(rollSpecialPower(powers, "easy", 0)).toBe("Potion");
  expect(rollSpecialPower(powers, "easy", 9.9 / 22)).toBe("Potion");
  expect(rollSpecialPower(powers, "easy", 10.5 / 22)).toBe("Star");
  expect(rollSpecialPower(powers, "easy", 12.5 / 22)).toBeNull();
});

test("executioner rolls never land on nothing", () => {
  expect(rollSpecialPower(powers, "executioner", 0.999)).toBe("Star");
});
