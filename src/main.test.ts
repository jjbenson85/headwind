import { headwind } from "./main";
import { describe, it, expect } from "vitest";
describe("headwind", () => {
  it("should be a function", () => {
    expect(headwind).toBeInstanceOf(Function);
  });
});
