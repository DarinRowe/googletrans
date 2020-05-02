"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var languages_1 = require("./languages");
var qs_1 = __importDefault(require("qs"));
var googleToken_1 = require("./googleToken");
var utils_1 = require("./utils");
/**
 *
 * @param {string} text - The text to be translated
 * @param {Object} opts - Options
 * @return {Promise} - Axios Promise
 */
function translate(text, opts) {
    opts = opts || {};
    var e;
    var FROMTO = [opts["from"], opts["to"]];
    FROMTO.forEach(function (lang) {
        if (lang && !languages_1.isSupported(lang)) {
            e = new Error("The language \u300C" + lang + "\u300Dis not suppored!");
            return new Promise(function (resolve, reject) {
                reject(e);
            });
        }
    });
    opts.from = opts.from || "auto";
    opts.to = opts.to || "en";
    opts.tld = opts.tld || "com";
    opts.from = languages_1.getCode(opts.from);
    opts.to = languages_1.getCode(opts.to);
    var URL = "https://translate.google." + opts.tld + "/translate_a/single";
    var TOKEN = googleToken_1.getToken(text);
    var PARAMS = {
        client: opts.client || "t",
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
    var HEADERS = {
        "User-Agent": utils_1.getUserAgent(),
        "Accept-Encoding": "gzip",
    };
    return axios_1.default({
        url: URL,
        params: PARAMS,
        headers: HEADERS,
        timeout: 3 * 1000,
        paramsSerializer: function (params) {
            return qs_1.default.stringify(params, { arrayFormat: "repeat" });
        },
    })
        .then(function (res) {
        return getResult(res);
    })
        .catch(function (error) {
        throw error;
    });
}
function getResult(res) {
    var result = {
        text: "",
        pronunciation: "",
        from: {
            language: {
                //language
                hasCorrectedLang: false,
                iso: "",
            },
            correct: {
                // correct source translate text
                hasCorrectedText: false,
                value: "",
            },
        },
        to: {
            translations: [],
        },
        raw: "",
    };
    if (res.status === 200)
        result.raw = res.data;
    var body = res.data;
    var a = body[0] && body[0];
    a.forEach(function (obj) {
        if (obj[0]) {
            result.text += obj[0];
        }
        if (obj[2]) {
            result.pronunciation += obj[2];
        }
    });
    if (body[2] === body[8][0][0]) {
        result.from.language.iso = body[2];
    }
    else {
        result.from.language.hasCorrectedLang = true;
        result.from.language.iso = body[8][0][0];
    }
    if (body[1] && body[1][0][2])
        result.to.translations = body[1][0][2];
    if (body[7] && body[7][0]) {
        var str = body[7][0];
        str = str.replace(/<b><i>/g, "[");
        str = str.replace(/<\/i><\/b>/g, "]");
        result.from.correct.value = str;
        var a_1 = false;
        var b = false;
        body[7][5] === true ? (a_1 = true) : (b = true);
        if (a_1 || b)
            result.from.correct.hasCorrectedText = true;
    }
    return result;
}
//tr()
module.exports = translate;
module.exports.getResult = getResult;
// tr.translate
// export { translate, getResult };
