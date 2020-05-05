"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var qs_1 = __importDefault(require("qs"));
var axios_1 = __importDefault(require("axios"));
var http_1 = __importDefault(require("axios/lib/adapters/http"));
var languages_1 = require("./languages");
var googleToken_1 = require("./googleToken");
var utils_1 = require("./utils");
/**
 * Translation
 * @param text - The text to be translated.
 * @param options - The  translation options. If the param is string, mean the language you want to translate into. If the param is object，can set more options.
 */
function googletrans(text, options) {
    var a;
    if (typeof options === "string") {
        a = { to: options };
    }
    else {
        a = options;
    }
    return translate(text, a);
}
exports.googletrans = googletrans;
/**
 * @param {string} text - The text to be translated
 * @param {Object} opts - Options
 * @return {Promise} - Axios Promise
 */
function translate(text, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var e, FROMTO, str, i, t, e_1, URL, TOKEN, PARAMS, HEADERS, res, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    opts = opts || {};
                    FROMTO = [opts["from"], opts["to"]];
                    FROMTO.forEach(function (lang) {
                        if (lang && !languages_1.isSupported(lang)) {
                            e = new Error("The language \u300C" + lang + "\u300Dis not suppored!");
                            throw e;
                        }
                    });
                    if (Array.isArray(text)) {
                        str = "";
                        for (i = 0; i < text.length; i++) {
                            t = text[i];
                            if (t.length === 0 && i === 0) {
                                e_1 = new Error("The first element of the text array is an empty string.");
                                throw e_1;
                            }
                            else {
                                str += t + "\n";
                            }
                        }
                        text = str;
                    }
                    if (text.length === 0) {
                        e = new Error("The text to be translated is empty!");
                        throw e;
                    }
                    opts.from = opts.from || "auto";
                    opts.to = opts.to || "en";
                    opts.tld = opts.tld || "com";
                    opts.client = opts.client || "t";
                    opts.from = languages_1.getCode(opts.from);
                    opts.to = languages_1.getCode(opts.to);
                    URL = "https://translate.google." + opts.tld + "/translate_a/single";
                    TOKEN = googleToken_1.getToken(text);
                    PARAMS = {
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
                    HEADERS = {
                        "User-Agent": utils_1.getUserAgent(),
                        "Accept-Encoding": "gzip",
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default({
                            adapter: http_1.default,
                            url: URL,
                            params: PARAMS,
                            headers: HEADERS,
                            timeout: 3 * 1000,
                            paramsSerializer: function (params) {
                                return qs_1.default.stringify(params, { arrayFormat: "repeat" });
                            },
                        })];
                case 2:
                    res = _a.sent();
                    return [2 /*return*/, getResult(res)];
                case 3:
                    error_1 = _a.sent();
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.translate = translate;
function getResult(res) {
    var result = {
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
    if (res === null)
        return result;
    if (res.status === 200)
        result.raw = res.data;
    var body = res.data;
    body[0].forEach(function (obj) {
        if (obj[0]) {
            result.text += obj[0];
        }
        if (obj[2]) {
            result.pronunciation += obj[2];
        }
    });
    if (body[2] === body[8][0][0]) {
        result.src = body[2];
    }
    else {
        result.hasCorrectedLang = true;
        result.src = body[8][0][0];
    }
    if (body[1] && body[1][0][2])
        result.translations = body[1][0][2];
    if (body[7] && body[7][0]) {
        var str = body[7][0];
        str = str.replace(/<b><i>/g, "[");
        str = str.replace(/<\/i><\/b>/g, "]");
        result.correctedText = str;
        var a = false;
        var b = false;
        body[7][5] === true ? (a = true) : (b = true);
        if (a || b)
            result.hasCorrectedText = true;
    }
    if (result.text.indexOf("\n") !== -1) {
        result.textArray = result.text.split("\n");
    }
    else {
        result.textArray.push(result.text);
    }
    return result;
}
exports.getResult = getResult;
exports.default = googletrans;
