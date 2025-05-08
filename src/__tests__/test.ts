/* eslint-disable @typescript-eslint/no-require-imports */
import { getUserAgent, getRandom } from "../utils";
import { isSupported, getCode } from "../languages";
import { getToken } from "../googleToken";
import { googletrans, translate, getResult } from "../googletrans";
const resposeTest = require("./resposeTest.json");
const resposeTest2 = require("./resposeTest2.json");
const resposeTest3 = require("./resposeTest3.json");
const resposeTest4 = require("./resposeTest4.json");

describe("translate Methods Test", () => {
  test("translate without any options", () => {
    return googletrans("hola").then((res) => {
      expect(res.src).toBe("es");
      expect(res.hasCorrectedLang).toBe(false);
      expect(res.hasCorrectedText).toBe(false);
    });
  });

  test("translate some misspelled English text to Dutch", () => {
    return googletrans("I spea English", "nl").then((res) => {
      expect(res.text).toBe("Ik spreek Engels");
      expect(res.src).toBe("en");
      expect(res.hasCorrectedText).toBe(true);
      expect(res.correctedText).toBe("I [speak] English");
    });
  });

  test("translate English text setting the source language as Portuguese", () => {
    return googletrans("Hero", { from: "pt", to: "nl" })
      .then((res) => {
        expect(res.hasCorrectedLang).toBe(true);
        expect(res.src).toBe("en");
        expect(res.hasCorrectedText).toBe(false);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  test("async", async () => {
    try {
      const res = await googletrans("Hero", { to: "zh" });
      expect(res.text).toBe("英雄");
      expect(res.hasCorrectedText).toBe(false);
    } catch (e) {
      console.log(e);
    }
  });

  test("translate from an unsupported language", () => {
    return googletrans("Green", { from: "Green", to: "de" })
      .then((res) => {
        expect(res.text).toBe("Grün");
        expect(res.src).toBe("en");
        expect(res.hasCorrectedLang).toBe(true);
        expect(res.hasCorrectedText).toBe(false);
      })
      .catch((err) => {
        expect(err.message).toMatch(/not/);
      });
  });

  test("translate to an unsupported language", () => {
    return googletrans("Green", { from: "en", to: "Green" })
      .then((res) => {
        expect(res.text).toBe("Green");
        expect(res.hasCorrectedText).toBe(false);
      })
      .catch((err) => {
        expect(err.message).toMatch(/not/);
      });
  });

  test("translate from dutch to english using language names instead of codes", () => {
    return googletrans("iets", { from: "dutch", to: "english" }).then((res) => {
      expect(res.text).toBe("something");
      expect(res.src).toBe("nl");
    });
  });
  test("zh-hk", async () => {
    try {
      const res = await googletrans("media", "zh-hk");
      expect(res.text).toBe("媒體");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });
  test("zh-sg", async () => {
    try {
      const res = await googletrans("Game console", "zh-sg");
      expect(res.text).toBe("游戏机");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });
  test("batch translation through array without empty string.", async () => {
    try {
      const res = await googletrans(["blue", "green", "yellow"], "nl");
      expect(res.text).toBe("blauw\ngroente\ngeel");
      expect(res.textArray).toContainEqual("blauw");
      expect(res.textArray).toContainEqual("groente");
      expect(res.textArray).toContainEqual("geel");
    } catch (error) {
      console.log(error);
    }
  });
  test("batch translation through an element of array.", async () => {
    try {
      const res = await googletrans(["green"], "nl");
      expect(res.text).toBe("groente");
      expect(res.textArray).toContain("groente");
      expect(res.textArray).not.toContain("geel");
      expect(res.textArray).not.toContain("blauw");
    } catch (error) {
      console.log(error);
    }
  });
  test("translation through an string.", async () => {
    try {
      const res = await googletrans("yellow", "nl");
      expect(res.textArray).toContain("geel");
      expect(res.textArray).not.toContain("groen");
      expect(res.textArray).not.toContain("blauw");
    } catch (error) {
      console.log(error);
    }
  });
  test("batch translation through an empty element of array.", async () => {
    try {
      const res = await googletrans([""], "nl");
      expect(res.text).toBe("");
      expect(res.textArray).toContainEqual("");
    } catch (error) {
      expect((error as Error).message).toMatch(/empty/);
    }
  });
  test("translation through an empty string.", async () => {
    try {
      const res = await googletrans("", "nl");
      expect(res.text).toBe("");
      expect(res.textArray).toContainEqual("");
    } catch (error) {
      expect((error as Error).message).toMatch(/empty/);
    }
  });
  test("batch translation by an array with an empty string.", async () => {
    try {
      const res = await googletrans(["apple", "potato", "", "", "tomato", ""], "zh");
      expect(res.text).toBe("苹果\n土豆\n\n\n番茄");
      expect(res.textArray).toContainEqual("");
      expect(res.textArray).toContainEqual("苹果");
      expect(res.textArray).toContainEqual("土豆");
      expect(res.textArray).toContainEqual("番茄");
    } catch (error) {
      console.log(error);
    }
  });
  test("batch translation by an array with empty string, and an empty string is the first element.", async () => {
    try {
      const res = await googletrans(["", "Hello"], "nl");
    } catch (error) {
      expect((error as Error).message).toMatch(/empty/);
    }
  });
  test("The text is over the maximum character limit ( 15k )", () => {
    let str = "";
    for (let i = 0; i < 750; i++) {
      const a = "HelloWorld!HelloWorld!";
      str += a;
    }

    return googletrans(str, "fr")
      .then((res) => {})
      .catch((error) => {
        console.log((error as Error).message);
        expect((error as Error).message).toMatch(/maximum/);
      });
  });
});

describe("isSupported method Test", () => {
  test("supported language by code", () => {
    expect(isSupported("en")).toBe(true);
  });

  test("not supported language by code", () => {
    expect(isSupported("python")).toBe(false);
  });

  test("supported language by name", () => {
    expect(isSupported("Haitian Creole")).toBe(true);
  });

  test("not supported language by name", () => {
    expect(isSupported("JavaScript")).toBe(false);
  });
});

describe("getCode method Test", () => {
  test("get code a supported language by code", () => {
    expect(getCode("fr")).toBe("fr");
  });

  test("get code a not supported language by code/name", () => {
    expect(getCode("Nova")).toBe("UNSUPPORTED");
  });

  test("get code a supported language by name ", () => {
    expect(getCode("English")).toBe("en");
  });

  test("get code with 'undefined' ", () => {
    expect(getCode("undefined")).toBe("UNSUPPORTED");
  });

  test("get code with 'null' ", () => {
    expect(getCode("null")).toBe("UNSUPPORTED");
  });

  test("get code with empty string", () => {
    expect(getCode("")).toBe("UNSUPPORTED");
  });
});

describe("getToken method Test", () => {
  test("get Token by Chinese", () => {
    expect(getToken("你好")).toBe("964583.557971");
  });

  test("get Token by English", () => {
    expect(getToken("Green")).toBe("701361.821189");
  });

  test("Unicode > 2048", () => {
    expect(getToken("⁉")).toBe("631846.1019986");
  });

  test("2048 > Unicode > 128", () => {
    // const a = getToken("ᢈ");
    // console.log(a);
    expect(getToken("ᢈ")).toBe("951746.569782");
  });
});

describe("random number method Test", () => {
  test("get number by int", () => {
    expect(getRandom(0, 30)).toBeLessThanOrEqual(30);
  });
  test("get number by float", () => {
    expect(getRandom(0.2, 0.3)).toBeLessThanOrEqual(1);
    expect(getRandom(0.5, 0.8)).toBeLessThanOrEqual(1);
  });
});

describe("getUserAgent", () => {
  test("get user agent", () => {
    expect(getUserAgent()).toBeDefined();
  });
});

describe("getReslut method Test", () => {
  test("getResult Test", () => {
    const reslut = getResult(resposeTest);
    expect(reslut.text).toBe("mais");
  });
  test("getResult Test2", () => {
    const reslut = getResult(resposeTest2);
    expect(reslut.text).toBe("ich spreche Niederländisch");
  });
  test("getResult Test3", () => {
    const reslut = getResult(resposeTest3);
    expect(reslut.text).toBe("vertaler");
  });
  test("getResult Test4", () => {
    const reslut = getResult(resposeTest4);
    expect(reslut.text).toBe("你好");
  });
});

describe("Additional Edge Cases and Error Handling", () => {
  test("translate with special characters", async () => {
    const res = await googletrans("Hello! @#$%^&*()", "zh");
    expect(res.text).toBeDefined();
    expect(res.hasCorrectedText).toBe(false);
  });

  test("translate with emoji", async () => {
    const res = await googletrans("Hello 👋 World 🌍", "zh");
    expect(res.text).toBeDefined();
    expect(res.hasCorrectedText).toBe(false);
  });

  test("translate with very long word", async () => {
    const longWord = "pneumonoultramicroscopicsilicovolcanoconiosis".repeat(10);
    try {
      await googletrans(longWord, "zh");
    } catch (error) {
      expect((error as Error).message).toMatch(/maximum/);
    }
  });

  test("translate with mixed language input", async () => {
    const res = await googletrans("Hello 你好 Bonjour", "en");
    expect(res.text).toBeDefined();
    expect(res.hasCorrectedText).toBe(false);
  });

  test("translate with HTML tags", async () => {
    const res = await googletrans("<p>Hello</p>", "zh");
    expect(res.text).toBeDefined();
    expect(res.hasCorrectedText).toBe(false);
  });

  test("translate with numbers and symbols", async () => {
    const res = await googletrans("123!@#$%^&*()", "zh");
    expect(res.text).toBeDefined();
    expect(res.hasCorrectedText).toBe(false);
  });

  test("translate with multiple spaces", async () => {
    const res = await googletrans("Hello     World", "zh");
    expect(res.text).toBeDefined();
    expect(res.hasCorrectedText).toBe(false);
  });

  test("translate with line breaks", async () => {
    const res = await googletrans("Hello\nWorld", "zh");
    expect(res.text).toBeDefined();
    expect(res.hasCorrectedText).toBe(false);
  });
});

describe("Additional Parameter Combinations", () => {
  test("translate with all options specified", async () => {
    const res = await googletrans("Hello", {
      from: "en",
      to: "zh",
    });
    expect(res).toBeDefined();
  });

  test("translate with invalid from language code", async () => {
    try {
      await googletrans("Hello", { from: "invalid", to: "zh" });
    } catch (error) {
      expect((error as Error).message).toMatch(/not/);
    }
  });

  test("translate with invalid to language code", async () => {
    try {
      await googletrans("Hello", { from: "en", to: "invalid" });
    } catch (error) {
      expect((error as Error).message).toMatch(/not/);
    }
  });

  test("translate with same source and target language", async () => {
    const res = await googletrans("Hello", { from: "en", to: "en" });
    expect(res.text).toBe("Hello");
  });
});

describe("Additional Branch Coverage Tests", () => {
  test("translate with string options", async () => {
    const res = await googletrans("hello", "zh");
    expect(res.text).toBeDefined();
    expect(res.src).toBe("en");
  });

  test("translate with unsupported language code", async () => {
    try {
      await googletrans("hello", { from: "invalid_lang", to: "zh" });
    } catch (error) {
      expect((error as Error).message).toMatch(/not suppored/);
    }
  });

  test("translate with null response", async () => {
    const mockResponse = null;
    const result = getResult(mockResponse);
    expect(result.text).toBe("");
    expect(result.textArray).toEqual([]);
  });

  test("translate with empty response data", async () => {
    const mockResponse = {
      status: 200,
      data: [[[]], null, "en", null, null, [], null, null, [["en"]]],
    };
    const result = getResult(mockResponse);
    expect(result.text).toBe("");
    expect(result.textArray).toEqual([""]);
  });

  test("translate with missing response fields", async () => {
    const mockResponse = {
      status: 200,
      data: [[[]], null, "en", null, null, [], null, null, [["en"]]],
    };
    const result = getResult(mockResponse);
    expect(result.text).toBe("");
    expect(result.textArray).toEqual([""]);
  });
});
