import { expect, test } from "bun:test";

import { fireEvent, render, screen } from "@testing-library/react";

import { useGameStore } from "@/store/gameStore";

import { DifficultyLevel } from "./difficultyLevel";

test("describes the level and selects it on click", () => {
  useGameStore.setState({ difficulty: null });
  render(
    <DifficultyLevel level="hard" tries={6} timer powers={2} active={false} />,
  );

  expect(screen.getByText("6 tries")).toBeDefined();
  expect(screen.getByText("With timer")).toBeDefined();
  expect(screen.getByText("2 powers")).toBeDefined();

  fireEvent.click(screen.getByRole("button"));
  expect(useGameStore.getState().difficulty).toBe("hard");
});

test("labels all powers and no powers", () => {
  render(
    <DifficultyLevel level="easy" tries={11} timer={false} powers active />,
  );
  render(
    <DifficultyLevel
      level="executioner"
      tries={6}
      timer
      powers={false}
      active={false}
    />,
  );

  expect(screen.getByText("No timer")).toBeDefined();
  expect(screen.getByText("All powers")).toBeDefined();
  expect(screen.getByText("No powers")).toBeDefined();
});
