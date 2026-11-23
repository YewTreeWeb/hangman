import { expect, test } from "bun:test";

import { getPowers, getSpecialPowers, type PowerState } from "./powerList";

const noop = () => {};

const actions = {
  clue: noop,
  reveal: noop,
  shield: noop,
  skip: noop,
  zap: noop,
  potion: noop,
  redPotion: noop,
  revival: noop,
  superZap: noop,
  superShield: noop,
  bernardsWatch: noop,
  magicStar: noop,
};

const fresh: PowerState = { lives: 3, usedPowers: [], unlockPowers: false };

const byName = (powers: ReturnType<typeof getPowers>, name: string) =>
  powers.find((p) => p.name === name);

test("easy starts with Clue, Shield and Skip unlocked", () => {
  const powers = getPowers(actions, "easy", fresh);

  expect(byName(powers, "Clue")?.locked).toBe(false);
  expect(byName(powers, "Skip")?.locked).toBe(false);
  expect(byName(powers, "Reveal")).toMatchObject({
    locked: true,
    toUnlock: 300,
  });
  expect(byName(powers, "Phone a Friend")).toBeDefined();
});

test("hard levels lock every normal power behind its level cost", () => {
  const powers = getPowers(actions, "executioner", fresh);

  expect(powers.every((p) => p.locked)).toBe(true);
  expect(byName(powers, "Shield")?.toUnlock).toBe(900);
  expect(byName(powers, "Phone a Friend")).toBeUndefined();
});

test("a Magic Star unlock frees Reveal and Zap on easy", () => {
  const powers = getPowers(actions, "easy", { ...fresh, unlockPowers: true });

  expect(byName(powers, "Reveal")?.locked).toBe(false);
  expect(byName(powers, "Zap")?.locked).toBe(false);
});

test("special powers follow the current lives and used powers", () => {
  const full = getSpecialPowers(actions, "medium", fresh);

  const hurt = getSpecialPowers(actions, "medium", {
    ...fresh,
    lives: 2,
    usedPowers: ["Clue"],
  });

  expect(byName(full, "Blue Potion")?.active).toBe(false);
  expect(byName(full, "Revival")?.active).toBe(false);
  expect(byName(hurt, "Blue Potion")?.active).toBe(true);
  expect(byName(hurt, "Revival")?.active).toBe(true);
  expect(byName(hurt, "Bernard's Watch")?.weight).toBe(3);
  expect(byName(hurt, "Magic Star")).toBeUndefined();
});
