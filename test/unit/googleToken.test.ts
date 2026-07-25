import { getToken } from "../../src/googleToken";

describe("getToken", () => {
  test.each([
    ["你好", "964583.557971"],
    ["Green", "701361.821189"],
    ["⁉", "631846.1019986"],
    ["ᢈ", "951746.569782"],
    ["😀", "916699.772271"],
    ["!@#$%^&*()_+", "510272.130356"],
  ])("generates a stable token for %j", (text, token) => {
    expect(getToken(text)).toBe(token);
  });

  test.each([
    "👨‍👩‍👧‍👦",
    "Hello⁉️😀",
    "A".repeat(1000),
    String.fromCharCode(2048),
    String.fromCharCode(2047),
    "🌍".repeat(50) + "⁉️".repeat(50),
  ])("handles Unicode and long input", (text) => {
    expect(getToken(text)).toMatch(/^\d+\.\d+$/);
  });
});
