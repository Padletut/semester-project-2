import { describe, it, expect, vi } from "vitest";
import { debounce } from "../../debounce.mjs";

describe("debounce", () => {
  it("should delay function execution by the specified time", async () => {
    const mockFunc = vi.fn();
    const debouncedFunc = debounce(mockFunc, 100);

    debouncedFunc();
    expect(mockFunc).not.toHaveBeenCalled();

    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(mockFunc).toHaveBeenCalledTimes(1);
  });

  it("should cancel previous calls if invoked again within the delay period", async () => {
    const mockFunc = vi.fn();
    const debouncedFunc = debounce(mockFunc, 100);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    expect(mockFunc).not.toHaveBeenCalled();

    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(mockFunc).toHaveBeenCalledTimes(1);
  });

  it("should execute the function exactly once after the delay", async () => {
    const mockFunc = vi.fn();
    const debouncedFunc = debounce(mockFunc, 100);

    debouncedFunc();
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(mockFunc).toHaveBeenCalledTimes(1);

    debouncedFunc();
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(mockFunc).toHaveBeenCalledTimes(2);
  });
});
