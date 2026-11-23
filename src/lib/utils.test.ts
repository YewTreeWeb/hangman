import { expect, test } from "bun:test";

import { roundPoints, wordPoints } from "./utils";

test("word points count unique letters times the level score", () => {
  expect(wordPoints("apple", "easy")).toBe(40);
  expect(wordPoints("apple", "hard")).toBe(120);
});

test("a streak above 1 multiplies the round's points, not the total score", () => {
  expect(roundPoints("apple", "easy", 0)).toBe(40);
  expect(roundPoints("apple", "easy", 1)).toBe(40);
  expect(roundPoints("apple", "easy", 3)).toBe(120);
});
