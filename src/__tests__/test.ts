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
    return translate("vue").then((res) => {
      expect(res.from.language.iso).toBe("fr");
      expect(res.from.language.hasCorrectedLang).toBe(false);
    });
  });

  test("translate some misspelled English text to German ", () => {
    return translate("I spea Dutch", { from: "en", to: "de" }).then((res) => {
      expect(res.text).toBe("ich spreche Niederländisch");
      expect(res.from.language.iso).toBe("en");
      expect(res.from.correct.hasCorrectedText).toBe(true);
      expect(res.from.correct.value).toBe("I [speak] Dutch");
    });
  });

  test("translate English text setting the source language as Portuguese", () => {
    return translate("Hero", { from: "pt", to: "nl" })
      .then((res) => {
        expect(res.from.language.hasCorrectedLang).toBe(true);
        expect(res.from.language.iso).toBe("en");
      })
      .catch((err) => {
        console.log(err);
      });
  });

  test("async", async () => {
    try {
      const res = await translate("Hero", { to: "zh" });
      expect(res.text).toBe("英雄");
    } catch (e) {
      console.log(e);
    }
  });

  test("translate from an unsupported language", () => {
    return translate("Green", { from: "Green", to: "de" })
      .then((res) => {
        expect(res.text).toBe("Grün");
        expect(res.from.language.iso).toBe("en");
        expect(res.from.language.hasCorrectedLang).toBe(true);
      })
      .catch((err) => {
        expect(err.message).toMatch(/not/);
      });
  });

  test("translate to an unsupported language", () => {
    return translate("Green", { from: "en", to: "Green" })
      .then((res) => {
        expect(res.text).toBe("Green");
      })
      .catch((err) => {
        expect(err.message).toMatch(/not/);
      });
  });

  test("translate from dutch to english using language names instead of codes", () => {
    return translate("iets", { from: "dutch", to: "english" }).then((res) => {
      expect(res.text).toBe("something");
      expect(res.from.language.iso).toBe("nl");
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

describe("googletrans", () => {
  test("batch translation", async () => {
    try {
      const res = await googletrans(["blue", "green", "yellow"], "nl");
      expect(res.text).toBe("blauw\ngroen\ngeel");
      expect(res.textArray).toContain("blauw");
      expect(res.textArray).toContain("groen");
      expect(res.textArray).toContain("geel");
      // expect(res.textArray).toContainEqual(["blauw", "groen", "geel"]);
    } catch (error) {
      console.log(error);
    }
  });
  test("batch translation by only one array.", async () => {
    try {
      const res = await googletrans(["green"], "nl");
      expect(res.text).toBe("groen");
      expect(res.textArray).toContain("groen");
      expect(res.textArray).not.toContain("geel");
      expect(res.textArray).not.toContain("blauw");
    } catch (error) {
      console.log(error);
    }
  });
  test("batch translation by only one string.", async () => {
    try {
      const res = await googletrans("yellow", "nl");
      expect(res.textArray).toContain("geel");
      expect(res.textArray).not.toContain("groen");
      expect(res.textArray).not.toContain("blauw");
    } catch (error) {
      console.log(error);
    }
  });
  test("batch translation by empty string array.", async () => {
    try {
      const res = await googletrans([""], "nl");
      expect(res.text).toBe("");
      console.log("batch translation by empty string array: " + res);
    } catch (error) {
      expect(error.message).toMatch(/empty/);
    }
  });
  test("batch translation by empty string array.", async () => {
    try {
      const res = await googletrans("", "nl");
      expect(res.text).toBe("");
    } catch (error) {
      expect(error.message).toMatch(/empty/);
    }
  });
  test("batch translation by empty string array1.", async () => {
    try {
      const res = await googletrans(["Hello", ""], "nl");
      expect(res.text).toBe("Hallo");
      // expect(res.textArray).toContain("");
      expect(res.textArray).toContain("Hallo");
      expect(res.textArray).toContainEqual(["Hallo", ""]);
    } catch (error) {
      console.log(error);
    }
  });
  test("batch translation by empty string array2.", async () => {
    try {
      const res = await googletrans(["", "Hello"], "nl");
      expect(res.text).toBe("Hallo");
      // expect(res.textArray).toContain("");
      expect(res.textArray).toContain("Hallo");
      expect(res.textArray).toContainEqual(["", "Hallo"]);
    } catch (error) {
      console.log(error);
    }
  });
});
