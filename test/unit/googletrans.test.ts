import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import qs from "qs";
import googletrans, { getResult, translate } from "../../src/googletrans";
import { basicResponse, batchResponse, correctedResponse } from "../fixtures/responses";

jest.mock("axios", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const axiosMock = axios as unknown as jest.MockedFunction<typeof axios>;

describe("googletrans", () => {
  beforeEach(() => {
    axiosMock.mockReset();
    axiosMock.mockResolvedValue(basicResponse);
  });

  test("uses stable request defaults and parses the response", async () => {
    const result = await googletrans("hello");

    expect(result).toMatchObject({
      text: "你好",
      textArray: ["你好"],
      pronunciation: "nǐ hǎo",
      src: "en",
      hasCorrectedLang: false,
      hasCorrectedText: false,
    });
    expect(axiosMock).toHaveBeenCalledTimes(1);

    const request = axiosMock.mock.calls[0][0] as AxiosRequestConfig;
    expect(request).toEqual(
      expect.objectContaining({
        url: "https://translate.google.com/translate_a/single",
        timeout: 3000,
        headers: expect.objectContaining({
          "Accept-Encoding": "gzip",
          "User-Agent": expect.any(String),
        }),
        params: expect.objectContaining({
          client: "t",
          sl: "auto",
          tl: "en",
          q: "hello",
          tk: expect.any(String),
        }),
      })
    );
    const paramsSerializer = request.paramsSerializer as (params: unknown) => string;
    expect(paramsSerializer(request.params)).toBe(
      qs.stringify(request.params, { arrayFormat: "repeat" })
    );
  });

  test("accepts string and object options", async () => {
    await googletrans("hello", "Dutch");
    expect(axiosMock.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        params: expect.objectContaining({ sl: "auto", tl: "nl" }),
      })
    );

    await googletrans("hello", {
      from: "English",
      to: "zh-cn",
      tld: " CO.JP ",
      client: "webapp",
    });
    expect(axiosMock.mock.calls[1][0]).toEqual(
      expect.objectContaining({
        url: "https://translate.google.co.jp/translate_a/single",
        params: expect.objectContaining({
          client: "webapp",
          sl: "en",
          tl: "zh-cn",
        }),
      })
    );
  });

  test("joins array input for a single request and returns textArray", async () => {
    axiosMock.mockResolvedValue(batchResponse);

    const result = await googletrans(["blue", "green"], "nl");

    expect(axiosMock.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        params: expect.objectContaining({ q: "blue\ngreen\n" }),
      })
    );
    expect(result.text).toBe("blauw\ngroen\n");
    expect(result.textArray).toEqual(["blauw", "groen", ""]);
  });

  test("parses corrected text and alternative translations", () => {
    const result = getResult(correctedResponse);

    expect(result).toMatchObject({
      text: "ik spreek Engels",
      src: "en",
      hasCorrectedText: true,
      correctedText: "I [speak] English",
      translations: [["spreken", ["speak"]]],
    });
  });

  test("uses a corrected source language when Google returns one", () => {
    const response = {
      status: 200,
      data: [[["held", "Hero", null]], null, "pt", null, null, null, null, null, [["en"]]],
    };

    expect(getResult(response)).toMatchObject({
      text: "held",
      src: "en",
      hasCorrectedLang: true,
    });
  });

  test("handles incomplete response segments and optional correction fields", () => {
    const response = {
      status: 200,
      data: [
        [
          null,
          [null, null, "fallback pronunciation"],
          ["translated", null, null],
        ],
        null,
        null,
        null,
        null,
        null,
        null,
        ["suggestion", null, null, null, null, false],
      ],
    };

    expect(getResult(response)).toMatchObject({
      text: "translated",
      textArray: ["translated"],
      pronunciation: "fallback pronunciation",
      src: "",
      hasCorrectedLang: false,
      correctedText: "suggestion",
      hasCorrectedText: false,
      translations: [],
    });
  });

  test("returns an empty result for a null response", () => {
    expect(getResult(null)).toEqual({
      text: "",
      textArray: [],
      pronunciation: "",
      hasCorrectedLang: false,
      src: "",
      hasCorrectedText: false,
      correctedText: "",
      translations: [],
      raw: [],
    });
  });

  test("rejects malformed response bodies", () => {
    expect(() => getResult({ status: 200, data: {} })).toThrow(
      "Unexpected response format from Google Translate."
    );
    expect(() => getResult({ status: 503, data: [] })).toThrow(
      "Unexpected response format from Google Translate."
    );
  });

  test.each([
    ["empty text", "", "The text to be translated is empty!"],
    [
      "empty first array element",
      ["", "hello"],
      "The first element of the text array is an empty string.",
    ],
    [
      "overlong text",
      "a".repeat(15001),
      "The text is over the maximum character limit ( 15k )!",
    ],
  ])("rejects %s", async (_name, input, message) => {
    await expect(googletrans(input, "en")).rejects.toThrow(message);
    expect(axiosMock).not.toHaveBeenCalled();
  });

  test.each([
    [{ from: "unknown", to: "en" }, "unknown"],
    [{ from: "en", to: "unknown" }, "unknown"],
  ])("rejects unsupported language options", async (options, language) => {
    await expect(googletrans("hello", options)).rejects.toThrow(
      `The language 「${language}」is not suppored!`
    );
    expect(axiosMock).not.toHaveBeenCalled();
  });

  test("rejects non-string language options", async () => {
    await expect(
      googletrans("hello", { to: 123 as unknown as string })
    ).rejects.toThrow('The language option "to" must be a string.');
  });

  test.each(["com@evil.example", ".com", "com/", "com..cn", ""])(
    "rejects unsafe tld %j",
    async (tld) => {
      await expect(googletrans("hello", { tld })).rejects.toThrow(
        'The option "tld" must be a valid Google Translate domain suffix.'
      );
    }
  );

  test("rejects a non-string tld", async () => {
    await expect(
      googletrans("hello", { tld: 123 as unknown as string })
    ).rejects.toThrow('The option "tld" must be a string.');
  });

  test("forwards AbortSignal and propagates cancellation errors", async () => {
    const controller = new AbortController();
    const canceledError = Object.assign(new Error("Request canceled"), {
      name: "CanceledError",
      code: "ERR_CANCELED",
    });
    axiosMock.mockRejectedValue(canceledError);

    const promise = translate("hello", { to: "zh-cn", signal: controller.signal });
    controller.abort();

    await expect(promise).rejects.toBe(canceledError);
    expect(axiosMock.mock.calls[0][0]).toEqual(
      expect.objectContaining({ signal: controller.signal })
    );
  });

  test("propagates transport errors", async () => {
    const error = new Error("network failed");
    axiosMock.mockRejectedValue(error);

    await expect(googletrans("hello")).rejects.toBe(error);
  });
});
