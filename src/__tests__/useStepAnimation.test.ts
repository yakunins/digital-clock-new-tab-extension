import { jest, beforeEach, afterEach, test, expect } from "@jest/globals";
import { renderHook, act } from "@testing-library/react";
import { useStepAnimation, AnimationStep } from "../hooks";

const steps: AnimationStep[] = [
    { label: "mounted", duration: 1 },
    { label: "transition", duration: 200 },
    { label: "finished", duration: 1 },
];

beforeEach(() => {
    jest.useFakeTimers();
});
afterEach(() => {
    jest.useRealTimers();
});

test("initial state matches targetStep with no animation", () => {
    const { result } = renderHook(() =>
        useStepAnimation({ targetStep: 3, steps })
    );
    expect(result.current.currentStep).toBe(3);
    expect(result.current.isAnimating).toBe(false);
    expect(result.current.direction).toBeNull();
    expect(result.current.currentLabel).toBe("finished");
    expect(result.current.isMounted).toBe(true);
});

test("returns isMounted false and currentLabel null at step 0", () => {
    const { result } = renderHook(() =>
        useStepAnimation({ targetStep: 0, steps })
    );
    expect(result.current.currentStep).toBe(0);
    expect(result.current.isMounted).toBe(false);
    expect(result.current.currentLabel).toBeNull();
});

test("animates forward through steps", () => {
    const { result, rerender } = renderHook(
        ({ target }) => useStepAnimation({ targetStep: target, steps }),
        { initialProps: { target: 0 } }
    );
    expect(result.current.currentStep).toBe(0);

    // Change target to last step
    rerender({ target: 3 });
    expect(result.current.direction).toBe("forward");
    expect(result.current.isAnimating).toBe(true);

    // Advance through step 0 (unmounted, duration -1 → delay 0)
    act(() => jest.advanceTimersByTime(0));
    expect(result.current.currentStep).toBe(1);
    expect(result.current.currentLabel).toBe("mounted");

    // Step 1 has duration 1, min 25 → delay 25
    act(() => jest.advanceTimersByTime(25));
    expect(result.current.currentStep).toBe(2);
    expect(result.current.currentLabel).toBe("transition");

    // Step 2 has duration 200 → delay 200
    act(() => jest.advanceTimersByTime(200));
    expect(result.current.currentStep).toBe(3);
    expect(result.current.currentLabel).toBe("finished");
    expect(result.current.isAnimating).toBe(false);
    expect(result.current.direction).toBeNull();
});

test("animates backward through steps", () => {
    const { result, rerender } = renderHook(
        ({ target }) => useStepAnimation({ targetStep: target, steps }),
        { initialProps: { target: 3 } }
    );
    expect(result.current.currentStep).toBe(3);

    rerender({ target: 0 });
    expect(result.current.direction).toBe("backward");

    // Step 3 (finished, duration 1) → delay 25 (minStepDuration)
    act(() => jest.advanceTimersByTime(25));
    expect(result.current.currentStep).toBe(2);

    // Step 2 (transition, duration 200) → delay 200
    act(() => jest.advanceTimersByTime(200));
    expect(result.current.currentStep).toBe(1);

    // Step 1 (mounted, duration 1) → delay 25
    act(() => jest.advanceTimersByTime(25));
    expect(result.current.currentStep).toBe(0);
    expect(result.current.isMounted).toBe(false);
    expect(result.current.direction).toBeNull();
});

test("durationStyles computed correctly", () => {
    const { result } = renderHook(() =>
        useStepAnimation({ targetStep: 3, steps })
    );
    expect(result.current.durationStyles).toEqual({
        "--duration-mounted": "1ms",
        "--duration-transition": "200ms",
        "--duration-finished": "1ms",
    });
});

test("durationStyles omits steps with no duration", () => {
    const stepsNoDuration: AnimationStep[] = [
        { label: "instant" },
        { label: "slow", duration: 500 },
    ];
    const { result } = renderHook(() =>
        useStepAnimation({ targetStep: 2, steps: stepsNoDuration })
    );
    expect(result.current.durationStyles).toEqual({
        "--duration-slow": "500ms",
    });
});
