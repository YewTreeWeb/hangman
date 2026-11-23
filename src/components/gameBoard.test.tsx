import { expect, test } from "bun:test";

import { fireEvent, render, screen } from "@testing-library/react";

import { TooltipProvider } from "@/components/ui/tooltip";
import type { PowerTypes } from "@/types/game-types";

import { Keyboard, PowerBar, Stats, WordDisplay } from "./gameBoard";

test("stats show score, streak and one heart per life", () => {
  render(
    <Stats
      score={120}
      streak={3}
      lives={2}
      shield="super"
      extraLife={false}
      poisoned
    />,
  );

  expect(screen.getByText("120")).toBeDefined();
  expect(screen.getByText("3").className).toContain("text-teal-400");
  expect(
    screen.getByLabelText("2 lives remaining").querySelectorAll("svg"),
  ).toHaveLength(2);
});

test("a red potion makes the first heart glow", () => {
  render(
    <Stats
      score={0}
      streak={0}
      lives={3}
      shield="shield"
      extraLife
      poisoned={false}
    />,
  );

  const hearts = screen
    .getByLabelText("3 lives remaining")
    .querySelectorAll("svg");

  expect(hearts[0]?.getAttribute("class")).toContain("text-yellow-400!");
  expect(hearts[1]?.getAttribute("class")).not.toContain("text-yellow-400!");
});

test("word display hides unguessed letters until the round ends", () => {
  const { rerender } = render(
    <WordDisplay word="cat" guessedLetters={["c"]} status="in-progress" />,
  );

  expect(screen.getByText("c").className).toContain("visible");
  expect(screen.getByText("t").className).toContain("invisible");

  rerender(<WordDisplay word="cat" guessedLetters={["c"]} status="lost" />);
  expect(screen.getByText("t").className).toContain("text-red-500");
});

test("keyboard disables guessed letters and hides zapped ones", () => {
  const guesses: string[] = [];

  render(
    <Keyboard
      guessedLetters={["a"]}
      zapped={["z"]}
      disabled={false}
      onGuess={(letter) => guesses.push(letter)}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "q" }));

  expect(guesses).toEqual(["q"]);
  expect(
    screen.getByRole("button", { name: "a" }).hasAttribute("disabled"),
  ).toBe(true);
  expect(screen.getByText("z").className).toContain("hidden");
});

const power = (name: string): PowerTypes => ({
  name,
  description: `${name} description`,
  Icon: () => null,
  active: true,
  onUse: () => {},
});

test("power bar shows held special powers and reports their use", () => {
  const used: string[] = [];

  render(
    <TooltipProvider>
      <PowerBar
        powers={[power("Clue"), power("Skip")]}
        specialPowers={[power("Super Zap"), power("Revival")]}
        wonPowers={{ "Super Zap": 2, Revival: 0 }}
        hideClue
        onUseSpecial={(p) => used.push(p.name)}
      />
    </TooltipProvider>,
  );

  expect(screen.queryByText("Revival")).toBeNull();
  expect(screen.getByText("Clue").closest("div.relative")?.className).toContain(
    "hidden",
  );

  fireEvent.click(screen.getByRole("button", { name: /Super Zap/ }));
  expect(used).toEqual(["Super Zap"]);
});
