interface Options {
    from?: string;
    to?: string;
    tld?: string;
    client?: string;
}
/**
 *
 * @param {string} text - The text to be translated
 * @param {Object} opts - Options
 * @return {Promise} - Axios Promise
 */
declare function translate(text: string, opts?: Options): Promise<{
    text: string;
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
        translations: never[];
    };
    raw: string;
}>;
declare function getResult(res: any): {
    text: string;
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
        translations: never[];
    };
    raw: string;
};
export default translate;
export { translate, getResult };
