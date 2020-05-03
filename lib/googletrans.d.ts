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
            hasCorrectedText: boolean;
            value: string;
        };
    };
    to: {
        translations: [];
    };
    raw: [];
}
declare function googletrans(text: string | string[], toLang: string): Promise<Result>;
/**
 * @param {string} text - The text to be translated
 * @param {Object} opts - Options
 * @return {Promise} - Axios Promise
 */
declare function translate(text: string | string[], opts?: Options): Promise<Result>;
declare function getResult(res: any): Result;
export default googletrans;
export { googletrans, translate, getResult };
