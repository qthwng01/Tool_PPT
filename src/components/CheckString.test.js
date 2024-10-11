import { describe, it, expect } from "vitest";
import { checkString } from "./CheckString";

describe("Function CheckString()", () => {
  it("should be string include ` (`", () => {
    const str = " (abc)";
    expect(checkString(str)).toBe(true);
  });
});
