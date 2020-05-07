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
    hasCorrectedLang: boolean;
    src: string;
    hasCorrectedText: boolean;
    correctedText: string;
    translations: [];
    raw: [];
}
/**
 * Translation
 * @param text - The text to be translated.
 * @param options - The  translation options. If the param is string, mean the language you want to translate into. If the param is object，can set more options.
 */
declare function googletrans(text: string | string[], options?: string | Options): Promise<Result>;
/**
 * @param {string} text - The text to be translated
 * @param {Object} opts - Options
 * @return {Promise} - Axios Promise
 */
declare function translate(text: string | string[], opts?: Options): Promise<Result>;
declare function getResult(res: any): Result;
export default googletrans;
export { googletrans, translate, getResult };
