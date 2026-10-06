import qs from "qs";
import axios from "axios";
import { Agent as HttpAgent } from "http";
import { Agent as HttpsAgent } from "https";
import { getCode } from "./languages";
import { getToken } from "./googleToken";
import { getUserAgent } from "./utils";

interface Options {
  from?: string;
  to?: string;
  tld?: string;
  client?: string;
  timeout?: number;
  signal?: AbortSignal;
  raw?: boolean;
}

const MAX_TEXT_LENGTH = 15_000;
const TEXT_LIMIT_ERROR = "The text is over the maximum character limit ( 15k )!";
// Bound idle connections without throttling active requests.
const agentOptions = { keepAlive: true, maxFreeSockets: 8, timeout: 10_000 };
const httpAgent = new HttpAgent(agentOptions);
const httpsAgent = new HttpsAgent(agentOptions);

interface Result {
  text: string;
  textArray: string[];
  pronunciation: string;
  hasCorrectedLang: boolean; // has correct source language?
  src: string; // source language
  hasCorrectedText: boolean; // has correct source text?
  correctedText: string; // correct source text
  translations: []; // multiple translations
  raw: [];
}

function getLanguageOption(value: unknown, field: "from" | "to") {
  if (typeof value !== "undefined" && typeof value !== "string") {
    throw new Error(`The language option "${field}" must be a string.`);
  }

  const language = value || (field === "from" ? "auto" : "en");
  const code = getCode(language);
  if (code === "UNSUPPORTED") {
    throw new Error(`The language 「${language}」is not suppored!`);
  }
  return code;
}

function getText(text: string | string[]) {
  if (Array.isArray(text) && text.length > 0) {
    if (text[0] === "") {
      throw new Error("The first element of the text array is an empty string.");
    }
    // Every array item contributes at least one newline.
    if (text.length > MAX_TEXT_LENGTH) {
      throw new Error(TEXT_LIMIT_ERROR);
    }
    let length = 0;
    for (const item of text) {
      if (typeof item !== "string") {
        throw new Error("The text must be a string or an array of strings.");
      }
      length += item.length + 1;
      if (length > MAX_TEXT_LENGTH) {
        throw new Error(TEXT_LIMIT_ERROR);
      }
    }
    return text.join("\n") + "\n";
  }

  if (Array.isArray(text) || text === "") {
    throw new Error("The text to be translated is empty!");
  }
  if (typeof text !== "string") {
    throw new Error("The text must be a string or an array of strings.");
  }
  if (text.length > MAX_TEXT_LENGTH) {
    throw new Error(TEXT_LIMIT_ERROR);
  }
  return text;
}

function getRawOption(value: unknown) {
  if (typeof value === "undefined") return true;
  if (typeof value !== "boolean") {
    throw new Error('The option "raw" must be a boolean.');
  }
  return value;
}

function getSafeTld(value: unknown) {
  if (typeof value === "undefined") {
    return "com";
  }

  if (typeof value !== "string") {
    throw new Error("The option \"tld\" must be a string.");
  }

  const normalized = value.trim().toLowerCase();
  const TLD_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*$/;

  if (!TLD_PATTERN.test(normalized)) {
    throw new Error("The option \"tld\" must be a valid Google Translate domain suffix.");
  }

  return normalized;
}

function getTimeout(value: unknown) {
  if (typeof value === "undefined") {
    return 10_000;
  }

  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 1 ||
    value > 2_147_483_647
  ) {
    throw new Error(
      'The option "timeout" must be between 1 and 2147483647 milliseconds.'
    );
  }

  return value;
}

function getResponseBody(res: any) {
  if (!res || res.status !== 200 || !Array.isArray(res.data) || !Array.isArray(res.data[0])) {
    throw new Error("Unexpected response format from Google Translate.");
  }

  return res.data;
}

/**
 * Translation
 * @param text - The text to be translated.
 * @param options - The translation options. If the param is string, mean the language you want to translate into. If the param is object，can set more options.
 */
function googletrans(text: string | string[], options?: string | Options) {
  return translate(text, typeof options === "string" ? { to: options } : options);
}

/**
 * @param {string} text - The text to be translated
 * @param {Object} opts - Options
 * @return {Promise} - Axios Promise
 */
async function translate(text: string | string[], opts?: Options) {
  const _opts = opts || {};

  const from = getLanguageOption(_opts.from, "from");
  const to = getLanguageOption(_opts.to, "to");
  const tld = getSafeTld(_opts.tld);
  const timeout = getTimeout(_opts.timeout);
  const raw = getRawOption(_opts.raw);
  const _text = getText(text);

  const URL = "https://translate.google." + tld + "/translate_a/single";
  const TOKEN = getToken(_text);

  const PARAMS = {
    client: _opts.client || "t",
    sl: from,
    tl: to,
    hl: "en",
    dt: ["at", "bd", "ex", "ld", "md", "qca", "rw", "rm", "ss", "t"],
    ie: "UTF-8",
    oe: "UTF-8",
    otf: 1,
    ssel: 0,
    tsel: 0,
    kc: 7,
    q: _text,
    tk: TOKEN,
  };

  const HEADERS = {
    "User-Agent": getUserAgent(),
    "Accept-Encoding": "gzip",
  };

  const res = await axios({
    url: URL,
    params: PARAMS,
    headers: HEADERS,
    timeout,
    signal: _opts.signal,
    httpAgent: axios.defaults.httpAgent ?? httpAgent,
    httpsAgent: axios.defaults.httpsAgent ?? httpsAgent,
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: "repeat" });
    },
  });
  return getResult(res, { raw });
}

function getResult(res: any, options: Pick<Options, "raw"> = {}): Result {
  const raw = getRawOption(options.raw);
  const result: Result = {
    text: "",
    textArray: [],
    pronunciation: "",
    hasCorrectedLang: false,
    src: "",
    hasCorrectedText: false,
    correctedText: "",
    translations: [],
    raw: [],
  };

  if (res === null) return result;

  const body = getResponseBody(res);
  if (raw) result.raw = body;

  body[0].forEach((obj: any) => {
    if (!Array.isArray(obj)) {
      return;
    }

    if (typeof obj[0] === "string") {
      result.text += obj[0];
    }
    if (typeof obj[2] === "string") {
      result.pronunciation += obj[2];
    }
  });

  const detectedSource = typeof body[2] === "string" ? body[2] : "";
  const correctedSource =
    Array.isArray(body[8]) && Array.isArray(body[8][0]) && typeof body[8][0][0] === "string"
      ? body[8][0][0]
      : detectedSource;

  result.src = correctedSource;
  result.hasCorrectedLang = Boolean(detectedSource && correctedSource && detectedSource !== correctedSource);

  if (Array.isArray(body[1]) && Array.isArray(body[1][0]) && body[1][0][2]) {
    result.translations = body[1][0][2];
  }

  if (Array.isArray(body[7]) && typeof body[7][0] === "string") {
    let str = body[7][0];
    str = str.replace(/<b><i>/g, "[");
    str = str.replace(/<\/i><\/b>/g, "]");
    result.correctedText = str;

    if (body[7][5]) result.hasCorrectedText = true;
  }

  if (result.text.indexOf("\n") !== -1) {
    result.textArray = result.text.split("\n");
  } else {
    result.textArray.push(result.text);
  }
  return result;
}

const compatibleDefault = Object.assign(googletrans, {
  default: googletrans,
  googletrans,
  translate,
  getResult,
});

export default compatibleDefault;
export { googletrans, translate, getResult };
