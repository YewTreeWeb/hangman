import type { LevelKey, PowerTypes } from "@/types/game-types";

const DEFAULT_WEIGHT = 10;

export const rollCost = (difficulty: LevelKey) =>
  difficulty === "executioner" ? 1000 : difficulty === "easy" ? 250 : 500;

/**
 * Weighted pick of a special power. One extra slot of default weight past the
 * end of the list is the "nothing" outcome, except on executioner where a roll
 * always wins.
 */
export const rollSpecialPower = (
  powers: PowerTypes[],
  difficulty: LevelKey,
  random = Math.random(),
) => {
  const nothingWeight = difficulty === "executioner" ? 0 : DEFAULT_WEIGHT;

  const total =
    powers.reduce((sum, p) => sum + (p.weight ?? DEFAULT_WEIGHT), 0) +
    nothingWeight;

  let roll = random * total;

  return (
    powers.find((p) => (roll -= p.weight ?? DEFAULT_WEIGHT) < 0)?.name ?? null
  );
};
