import qs from "qs";
import axios from "axios";
import adapter from "axios/lib/adapters/http";
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
  from: {
    language: {
      hasCorrectedLang: boolean;
      iso: string;
    };
    correct: {
      // correct source translate text
      hasCorrectedText: boolean;
      value: string;
    };
  };
  to: {
    translations: []; // multiple translations
  };
  raw: [];
}

function googletrans(text: string | string[], toLang: string) {
  return translate(text, { to: toLang });
}

/**
 * @param {string} text - The text to be translated
 * @param {Object} opts - Options
 * @return {Promise} - Axios Promise
 */
async function translate(text: string | string[], opts?: Options) {
  opts = opts || {};
  let e: Error;
  const FROMTO = [opts["from"], opts["to"]];
  FROMTO.forEach((lang) => {
    if (lang && !isSupported(lang)) {
      e = new Error(`The language 「${lang}」is not suppored!`);
      throw e;
    }
  });

  if (Array.isArray(text)) {
    let str = "";
    for (let i = 0; i < text.length; i++) {
      const t = text[i];
      if (t.length === 0 && i === 0) {
        const e = new Error(
          "The first element of the text array is an empty string."
        );
        throw e;
      } else {
        str += t + "\n";
      }
    }
    text = str;
  }

  if (text.length === 0) {
    e = new Error(`The text to be translated is empty!`);
    throw e;
  }

  opts.from = opts.from || "auto";
  opts.to = opts.to || "en";
  opts.tld = opts.tld || "com";
  opts.client = opts.client || "t";

  opts.from = getCode(opts.from);
  opts.to = getCode(opts.to);
  const URL = "https://translate.google." + opts.tld + "/translate_a/single";
  const TOKEN = getToken(text);

  const PARAMS = {
    client: opts.client,
    sl: opts.from,
    tl: opts.to,
    hl: "en",
    dt: ["at", "bd", "ex", "ld", "md", "qca", "rw", "rm", "ss", "t"],
    ie: "UTF-8",
    oe: "UTF-8",
    otf: 1,
    ssel: 0,
    tsel: 0,
    kc: 7,
    q: text,
    tk: TOKEN,
  };

  const HEADERS = {
    "User-Agent": getUserAgent(),
    "Accept-Encoding": "gzip",
  };

  try {
    const res = await axios({
      adapter,
      url: URL,
      params: PARAMS,
      headers: HEADERS,
      timeout: 3 * 1000,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "repeat" });
      },
    });
    return getResult(res);
  } catch (error) {
    throw error;
  }
}

function getResult(res: any): Result {
  let result: Result = {
    text: "",
    textArray: [],
    pronunciation: "",
    from: {
      language: {
        //language
        hasCorrectedLang: false, // correct source language
        iso: "", // source language
      },
      correct: {
        // correct source translate text
        hasCorrectedText: false, // correct source text
        value: "", // correct value
      },
    },
    to: {
      translations: [], // multiple translations
    },
    raw: [],
  };
  if (res === null) return result;
  if (res.status === 200) result.raw = res.data;
  const body = res.data;
  const a = body[0] && body[0];
  a.forEach((obj: string) => {
    if (obj[0]) {
      result.text += obj[0];
    }
    if (obj[2]) {
      result.pronunciation += obj[2];
    }
  });

  if (body[2] === body[8][0][0]) {
    result.from.language.iso = body[2];
  } else {
    result.from.language.hasCorrectedLang = true;
    result.from.language.iso = body[8][0][0];
  }

  if (body[1] && body[1][0][2]) result.to.translations = body[1][0][2];

  if (body[7] && body[7][0]) {
    let str = body[7][0];
    str = str.replace(/<b><i>/g, "[");
    str = str.replace(/<\/i><\/b>/g, "]");
    result.from.correct.value = str;

    let a = false;
    let b = false;
    body[7][5] === true ? (a = true) : (b = true);
    if (a || b) result.from.correct.hasCorrectedText = true;
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
