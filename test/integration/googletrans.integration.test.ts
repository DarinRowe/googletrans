import { googletrans as googletransBase } from "../../src/googletrans";
import { withNetworkRetries } from "../helpers/network";

const googletrans = withNetworkRetries(googletransBase);

describe("Google Translate integration", () => {
  test("translates text and detects its source language", async () => {
    const result = await googletrans("hello", { to: "zh" });

    expect(result.text.length).toBeGreaterThan(0);
    expect(result.src).toBe("en");
  });

  test("translates an array as a batch", async () => {
    const result = await googletrans(["blue", "green"], { from: "en", to: "nl" });

    expect(result.text.length).toBeGreaterThan(0);
    expect(result.textArray.length).toBeGreaterThanOrEqual(2);
  });

  test("auto-detects a non-English source", async () => {
    const result = await googletrans("Bonjour le monde", "en");

    expect(result.text.length).toBeGreaterThan(0);
    expect(result.src).toBe("fr");
  });

  test("handles a spelling-correction response", async () => {
    const result = await googletrans("I spea English", { from: "en", to: "nl" });

    expect(result.text.length).toBeGreaterThan(0);
    expect(typeof result.hasCorrectedText).toBe("boolean");
    expect(typeof result.correctedText).toBe("string");
  });
});
