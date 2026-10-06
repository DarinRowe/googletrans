import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import qs from "qs";
import googletrans, { getResult, translate } from "../../src/googletrans";
import { basicResponse, batchResponse, correctedResponse } from "../fixtures/responses";

jest.mock("axios", () => ({
  __esModule: true,
  default: Object.assign(jest.fn(), { defaults: {} }),
}));

const axiosMock = axios as unknown as jest.MockedFunction<typeof axios>;

describe("googletrans", () => {
  beforeEach(() => {
    axiosMock.mockReset();
    axiosMock.mockResolvedValue(basicResponse);
    delete axios.defaults.httpAgent;
    delete axios.defaults.httpsAgent;
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
        timeout: 10000,
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
      timeout: 5000,
    });
    expect(axiosMock.mock.calls[1][0]).toEqual(
      expect.objectContaining({
        url: "https://translate.google.co.jp/translate_a/single",
        timeout: 5000,
        params: expect.objectContaining({
          client: "webapp",
          sl: "en",
          tl: "zh-cn",
        }),
      })
    );
  });

  test("shares a keep-alive agent with bounded idle sockets", async () => {
    await googletrans("hello");
    await googletrans("world");
    const first = axiosMock.mock.calls[0][0] as AxiosRequestConfig;
    const second = axiosMock.mock.calls[1][0] as AxiosRequestConfig;
    expect(first.httpAgent).toBe(second.httpAgent);
    expect(first.httpsAgent).toBe(second.httpsAgent);
    for (const agent of [first.httpAgent, first.httpsAgent]) {
      expect(agent.keepAlive).toBe(true);
      expect(agent.maxFreeSockets).toBe(8);
      expect(agent.maxSockets).toBe(Infinity);
    }
  });

  test("honors a caller's Axios agent", async () => {
    const agent = { custom: true };
    axios.defaults.httpAgent = agent;
    axios.defaults.httpsAgent = agent;
    await googletrans("hello");
    expect(axiosMock.mock.calls[0][0]).toEqual(
      expect.objectContaining({ httpAgent: agent, httpsAgent: agent })
    );
  });

  test("honors explicitly disabled Axios agents", async () => {
    axios.defaults.httpAgent = false;
    axios.defaults.httpsAgent = false;
    await googletrans("hello");
    expect(axiosMock.mock.calls[0][0]).toEqual(
      expect.objectContaining({ httpAgent: false, httpsAgent: false })
    );
  });

  test("keeps raw responses by default and supports opting out", async () => {
    axiosMock.mockResolvedValue(correctedResponse);
    const full = await googletrans("I spea English");
    const compact = await googletrans("I spea English", { raw: false });

    expect(full.raw).toBe(correctedResponse.data);
    expect(compact.raw).toEqual([]);
    expect({ ...compact, raw: full.raw }).toEqual(full);
    expect(getResult(correctedResponse, { raw: false })).toEqual(compact);
    expect(getResult(null, { raw: false }).raw).toEqual([]);
  });

  test.each([null, 0, "false"])("rejects invalid raw option %p before requesting", async (raw) => {
    await expect(googletrans("hello", { raw: raw as unknown as boolean })).rejects.toThrow(
      'The option "raw" must be a boolean.'
    );
    expect(axiosMock).not.toHaveBeenCalled();
  });

  test("accepts the largest timeout supported by Node.js timers", async () => {
    await googletrans("hello", { timeout: 2_147_483_647 });

    expect(axiosMock.mock.calls[0][0]).toEqual(
      expect.objectContaining({ timeout: 2_147_483_647 })
    );
  });

  test("accepts frozen options without mutating them", async () => {
    const options = Object.freeze({ from: "English", to: "Dutch", tld: " CO.JP ", raw: false });
    await googletrans("hello", options);
    expect(options).toEqual({ from: "English", to: "Dutch", tld: " CO.JP ", raw: false });
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

  test("counts trailing and empty-item newlines toward the input limit", async () => {
    await googletrans("a".repeat(15000));
    await googletrans(["a".repeat(14999)]);
    await googletrans(["a".repeat(14998), ""]);
    await expect(googletrans(["a".repeat(15000)])).rejects.toThrow("maximum character limit");
    await expect(googletrans(["a".repeat(14999), ""])).rejects.toThrow("maximum character limit");
    expect(axiosMock).toHaveBeenCalledTimes(3);
    expect((axiosMock.mock.calls[2][0] as AxiosRequestConfig).params.q).toHaveLength(15000);
  });

  test("rejects excessive item counts without reading the rest of the array", async () => {
    const texts = ["hello"];
    texts.length = 15001;
    Object.defineProperty(texts, 1, {
      get() { throw new Error("Array tail must not be read"); },
    });
    await expect(googletrans(texts)).rejects.toThrow("maximum character limit");
    expect(axiosMock).not.toHaveBeenCalled();
  });

  test("stops reading once cumulative input length exceeds the limit", async () => {
    const texts = ["a".repeat(15000)];
    Object.defineProperty(texts, 1, {
      get() { throw new Error("Array tail must not be read"); },
    });
    await expect(googletrans(texts)).rejects.toThrow("maximum character limit");
    expect(axiosMock).not.toHaveBeenCalled();
  });

  test.each([null, undefined, 123, {}, ["hello", 123], new Array(2)])(
    "rejects non-string text %p before requesting",
    async (text) => {
      await expect(googletrans(text as unknown as string)).rejects.toThrow(
        "The text must be a string or an array of strings."
      );
      expect(axiosMock).not.toHaveBeenCalled();
    }
  );

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
    ["empty array", [], "The text to be translated is empty!"],
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
    [{ to: "constructor" }, "constructor"],
    [{ from: "__proto__" }, "__proto__"],
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

  test.each([
    0,
    0.5,
    -1,
    2_147_483_648,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    "1000",
  ])(
    "rejects invalid timeout %p",
    async (timeout) => {
      await expect(
        googletrans("hello", { timeout: timeout as unknown as number })
      ).rejects.toThrow(
        'The option "timeout" must be between 1 and 2147483647 milliseconds.'
      );
      expect(axiosMock).not.toHaveBeenCalled();
    }
  );

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
