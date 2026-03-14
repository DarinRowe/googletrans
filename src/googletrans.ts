import qs from "qs";
import axios from "axios";
// import adapter from "axios/lib/adapters/http";
import { isSupported, getCode } from "./languages";
import { getToken } from "./googleToken";
import { getUserAgent } from "./utils";

interface Options {
  from?: string;
  to?: string;
  tld?: string;
  client?: string;
}

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

function getStringOption(value: unknown, field: "from" | "to") {
  if (typeof value === "undefined") {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error(`The language option "${field}" must be a string.`);
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
  let a: any;
  if (typeof options === "string") {
    a = { to: options };
  } else {
    a = options;
  }
  return translate(text, a);
}

/**
 * @param {string} text - The text to be translated
 * @param {Object} opts - Options
 * @return {Promise} - Axios Promise
 */
async function translate(text: string | string[], opts?: Options) {
  const _opts = { ...(opts || {}) };
  let _text = text;
  let e: Error;

  const from = getStringOption(_opts.from, "from");
  const to = getStringOption(_opts.to, "to");
  const tld = getSafeTld(_opts.tld);

  [from, to].forEach((lang) => {
    if (lang && !isSupported(lang)) {
      e = new Error(`The language 「${lang}」is not suppored!`);
      throw e;
    }
  });

  if (Array.isArray(_text)) {
    let str = "";
    for (let i = 0; i < _text.length; i++) {
      const t = _text[i];
      if (t.length === 0 && i === 0) {
        const e = new Error("The first element of the text array is an empty string.");
        throw e;
      } else {
        str += t + "\n";
      }
    }
    _text = str;
  }

  if (_text.length === 0) {
    e = new Error("The text to be translated is empty!");
    throw e;
  }
  if (_text.length > 15000) {
    e = new Error("The text is over the maximum character limit ( 15k )!");
    throw e;
  }

  _opts.from = getCode(from || "auto");
  _opts.to = getCode(to || "en");
  _opts.tld = tld;
  _opts.client = _opts.client || "t";

  const URL = "https://translate.google." + _opts.tld + "/translate_a/single";
  const TOKEN = getToken(_text);

  const PARAMS = {
    client: _opts.client,
    sl: _opts.from,
    tl: _opts.to,
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
    // adapter,
    url: URL,
    params: PARAMS,
    headers: HEADERS,
    timeout: 3 * 1000,
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: "repeat" });
    },
  });
  return getResult(res);
}

function getResult(res: any): Result {
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
  result.raw = body;

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

export default googletrans;
export { googletrans, translate, getResult };
