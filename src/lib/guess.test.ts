import { expect, test } from "bun:test";

import { maxWrongGuesses, roundStatus, wrongGuesses } from "./guess";

test("hard levels allow fewer wrong guesses", () => {
  expect(maxWrongGuesses("easy")).toBe(11);
  expect(maxWrongGuesses("medium")).toBe(11);
  expect(maxWrongGuesses("hard")).toBe(6);
  expect(maxWrongGuesses("executioner")).toBe(6);
});

test("wrong guesses count letters missing from the word", () => {
  expect(wrongGuesses("cat", ["c", "x", "y"])).toBe(2);
});

test("a round is won once every letter is guessed", () => {
  expect(roundStatus("cat", ["c", "a"], "easy")).toBe("in-progress");
  expect(roundStatus("cat", ["t", "a", "c"], "easy")).toBe("won");
});

test("a round is lost at the level's wrong-guess limit", () => {
  const sixWrong = [..."bdefgh"];

  expect(roundStatus("cat", sixWrong, "hard")).toBe("lost");
  expect(roundStatus("cat", sixWrong, "easy")).toBe("in-progress");
});
