import { expect, jest, test } from "bun:test";

import { act, renderHook } from "@testing-library/react";

import { useAutoAdvance, useAutoClose } from "./useRoundTimers";

test("auto-advance shows loading at 2s and loads the next word at 4s", () => {
  jest.useFakeTimers();
  let advanced = 0;

  const { result, rerender } = renderHook(
    ({ over }) => useAutoAdvance(over, 3, () => advanced++),
    { initialProps: { over: false } },
  );

  rerender({ over: true });
  act(() => jest.advanceTimersByTime(2000));
  expect(result.current).toBe(true);

  act(() => jest.advanceTimersByTime(2000));
  expect(result.current).toBe(false);
  expect(advanced).toBe(1);
  jest.useRealTimers();
});

test("auto-advance stops when the player has no lives", () => {
  jest.useFakeTimers();
  let advanced = 0;

  renderHook(() => useAutoAdvance(true, 0, () => advanced++));
  act(() => jest.advanceTimersByTime(5000));

  expect(advanced).toBe(0);
  jest.useRealTimers();
});

test("auto-close fires once after the delay while open", () => {
  jest.useFakeTimers();
  let closed = 0;

  renderHook(() => useAutoClose(true, () => closed++, 3000));
  act(() => jest.advanceTimersByTime(2999));
  expect(closed).toBe(0);

  act(() => jest.advanceTimersByTime(1));
  expect(closed).toBe(1);
  jest.useRealTimers();
});
