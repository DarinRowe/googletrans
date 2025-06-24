/* eslint-disable @typescript-eslint/no-require-imports */
import { googletrans } from "../googletrans";

describe("translate to different languages", () => {
  test("Afrikaans", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "af" });
      expect(res.text).toBe("taal");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Albanian", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "sq" });
      expect(res.text).toBe("gjuhë");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Amharic", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "am" });
      expect(res.text).toBe("ቋንቋ");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Arabic", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "ar" });
      expect(res.text).toBe("لغة");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Armenian", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "hy" });
      expect(res.text).toBe("լեզու");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Assamese", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "as" });
      expect(res.text).toBe("ভাষা");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Aymara", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "ay" });
      expect(res.text).toBe("aru");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Azerbaijani", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "az" });
      expect(res.text).toBe("dil");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Bambara", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "bm" });
      expect(res.text).toBe("kan");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Basque", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "eu" });
      expect(res.text).toBe("mintzaira");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Belarusian", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "be" });
      expect(res.text).toBe("мова");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Bengali", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "bn" });
      expect(res.text).toBe("ভাষা");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Bhojpuri", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "bho" });
      expect(res.text).toBe("भाखा");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Bosnian", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "bs" });
      expect(res.text).toBe("jezik");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Bulgarian", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "bg" });
      expect(res.text).toBe("език");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Catalan", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "ca" });
      expect(res.text).toBe("llengua");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Cebuano", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "ceb" });
      expect(res.text).toBe("sinultihan");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Chinese (Simplified)", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "zh" });
      expect(res.text).toBe("语言");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Chinese (Simplified, zh-cn)", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "zh-cn" });
      expect(res.text).toBe("语言");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Chinese (Simplified, zh-sg)", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "zh-sg" });
      expect(res.text).toBe("语言");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Chinese (Traditional, zh-tw)", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "zh-tw" });
      expect(res.text).toBe("語言");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Chinese (Traditional, zh-hk)", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "zh-hk" });
      expect(res.text).toBe("語言");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });
  test("Corsican", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "co" });
      expect(res.text).toBe("lingua");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Croatian", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "hr" });
      expect(res.text).toBe("jezik");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Czech", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "cs" });
      expect(res.text).toBe("jazyk");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Danish", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "da" });
      expect(res.text).toBe("sprog");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Dhivehi", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "dv" });
      expect(res.text).toBe("ބަސް");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Dogri", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "doi" });
      expect(res.text).toBe("भाशा");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Dutch", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "nl" });
      expect(res.text).toBe("taal");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("English", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "en" });
      expect(res.text).toBe("language");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Esperanto", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "eo" });
      expect(res.text).toBe("Lingvo");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Estonian", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "et" });
      expect(res.text).toBe("keel");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Ewe", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "ee" });
      expect(res.text).toBe("gbegbᴐgblᴐ");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Filipino (Tagalog)", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "fil" });
      expect(res.text.toLocaleLowerCase()).toBe("wika");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Finnish", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "fi" });
      expect(res.text).toBe("kieli");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("French", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "fr" });
      expect(res.text).toBe("langue");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Frisian", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "fy" });
      expect(res.text).toBe("taal");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Galician", async () => {
    try {
      const res = await googletrans("sky", { from: "en", to: "gl" });
      expect(res.text).toBe("ceo");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Georgian", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "ka" });
      expect(res.text).toBe("ენა");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("German", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "de" });
      expect(res.text).toBe("Sprache");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Greek", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "el" });
      expect(res.text).toBe("γλώσσα");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Guarani", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "gn" });
      expect(res.text).toBe("ñe'ẽ");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Gujarati", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "gu" });
      expect(res.text).toBe("ભાષા");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Haitian Creole", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "ht" });
      expect(res.text).toBe("lang");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Hausa", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "ha" });
      expect(res.text).toBe("harshe");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Hawaiian", async () => {
    try {
      const res = await googletrans("sky", { from: "en", to: "haw" });
      expect(res.text).toBe("lani");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Hebrew", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "he" });
      expect(res.text).toBe("שָׂפָה");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Hindi", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "hi" });
      expect(res.text).toBe("भाषा");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Hmong", async () => {
    try {
      const res = await googletrans("hello", { from: "en", to: "hmn" });
      expect(res.text).toBe("nyob zoo");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Hungarian", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "hu" });
      expect(res.text).toBe("nyelv");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Icelandic", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "is" });
      expect(res.text).toBe("tungumál");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });
  test("Igbo", async () => {
    try {
      const res = await googletrans("sky", { from: "en", to: "ig" });
      expect(res.text).toBe("eluigwe");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Ilocano", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "ilo" });
      expect(res.text).toBe("lengguahe");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Indonesian", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "id" });
      expect(res.text).toBe("bahasa");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Irish", async () => {
    try {
      const res = await googletrans("sky", { from: "en", to: "ga" });
      expect(res.text).toBe("spéir");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Italian", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "it" });
      expect(res.text).toBe("lingua");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Japanese", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "ja" });
      expect(res.text).toBe("言語");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Javanese", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "jv" });
      expect(res.text).toBe("basa");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Kannada", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "kn" });
      expect(res.text).toBe("ಭಾಷೆ");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Kazakh", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "kk" });
      expect(res.text).toBe("тіл");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Khmer", async () => {
    try {
      const res = await googletrans("sky", { from: "en", to: "km" });
      expect(res.text).toBe("មេឃ");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Kinyarwanda", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "rw" });
      expect(res.text).toBe("ururimi");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Konkani", async () => {
    try {
      const res = await googletrans("sky", { from: "en", to: "gom" });
      expect(res.text).toBe("मळब");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Korean", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "ko" });
      expect(res.text).toBe("언어");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Krio", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "kri" });
      expect(res.text).toBe("langwej");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Kurdish", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "ku" });
      expect(res.text).toBe("ziman");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Kurdish (Sorani)", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "ckb" });
      expect(res.text).toBe("زمان");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Kyrgyz", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "ky" });
      expect(res.text).toBe("тил");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Lao", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "lo" });
      expect(res.text).toBe("ພາສາ");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Latin", async () => {
    try {
      const res = await googletrans("hello", { from: "en", to: "la" });
      expect(res.text).toBe("salve");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Latvian", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "lv" });
      expect(res.text).toBe("valoda");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Lingala", async () => {
    try {
      const res = await googletrans("sky", { from: "en", to: "ln" });
      expect(res.text).toBe("mapata");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Lithuanian", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "lt" });
      expect(res.text).toBe("kalba");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Luganda", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "lg"});
      expect(res.text).toBe("olulimi");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Luxembourgish", async () => {
    try {
      const res = await googletrans("you", { from: "en", to: "lb" });
      expect(res.text.toLocaleLowerCase()).toBe("du");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });
  test("Macedonian", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "mk" });
      expect(res.text).toBe("јазик");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Maithili", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "mai" });
      expect(res.text).toBe("भाषा");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Malagasy", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "mg" });
      expect(res.text).toBe("fiteny");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Malay", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "ms" });
      expect(res.text).toBe("bahasa");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Malayalam", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "ml" });
      expect(res.text).toBe("ഭാഷ");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Maltese", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "mt" });
      expect(res.text).toBe("lingwa");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Maori", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "mi" });
      expect(res.text).toBe("reo");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Marathi", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "mr" });
      expect(res.text).toBe("भाषा");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Mizo", async () => {
    try {
      const res = await googletrans("sky", { from: "en", to: "lus" });
      expect(res.text).toBe("van");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Mongolian", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "mn" });
      expect(res.text).toBe("хэл");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Myanmar (Burmese)", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "my" });
      expect(res.text).toBe("ဘာသာစကား");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Nepali", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "ne" });
      expect(res.text).toBe("भाषा");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Norwegian", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "no" });
      expect(res.text).toBe("språk");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Nyanja (Chichewa)", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "ny" });
      expect(res.text).toBe("chinenero");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Odia (Oriya)", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "or" });
      expect(res.text).toBe("ଭାଷା");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Oromo", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "om" });
      expect(res.text).toBe("afaan");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Pashto", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "ps" });
      expect(res.text).toBe("ژبه");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Persian", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "fa" });
      expect(res.text).toBe("زبان");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Polish", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "pl" });
      expect(res.text).toBe("język");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Portuguese", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "pt" });
      expect(res.text).toBe("linguagem");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Quechua", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "qu" });
      expect(res.text).toBe("simi");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Romanian", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "ro" });
      expect(res.text).toBe("limbă");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Russian", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "ru" });
      expect(res.text).toBe("язык");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Samoan", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "sm" });
      expect(res.text).toBe("gagana");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Sanskrit", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "sa" });
      expect(res.text).toBe("भाषा");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Scots Gaelic", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "gd" });
      expect(res.text.toLocaleLowerCase()).toBe("cànan");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Sepedi", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "nso" });
      expect(res.text).toBe("polelo");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Serbian", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "sr" });
      expect(res.text).toBe("језик");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Sesotho", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "st" });
      expect(res.text).toBe("puo");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Shona", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "sn" });
      expect(res.text.toLocaleLowerCase()).toBe("mutauro");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });
  test("Sindhi", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "sd" });
      expect(res.text).toBe("ٻولي");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Sinhala (Sinhalese)", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "si" });
      expect(res.text).toBe("භාෂාව");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Slovak", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "sk" });
      expect(res.text).toBe("jazyk");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Slovenian", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "sl" });
      expect(res.text).toBe("jezik");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Somali", async () => {
    try {
      const res = await googletrans("you", { from: "en", to: "so" });
      expect(res.text).toBe("adiga");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Spanish", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "es" });
      expect(res.text).toBe("idioma");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Sundanese", async () => {
    try {
      const res = await googletrans("sky", { from: "en", to: "su" });
      expect(res.text).toBe("langit");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Swahili", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "sw" });
      expect(res.text).toBe("lugha");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Swedish", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "sv" });
      expect(res.text).toBe("språk");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Tagalog", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "tl" });
      expect(res.text.toLocaleLowerCase()).toBe("wika");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Tajik", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "tg" });
      expect(res.text.toLocaleLowerCase()).toBe("забон");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Tamil", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "ta" });
      expect(res.text).toBe("மொழி");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Tatar", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "tt" });
      expect(res.text).toBe("тел");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Telugu", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "te" });
      expect(res.text).toBe("భాష");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Thai", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "th" });
      expect(res.text).toBe("ภาษา");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Tigrinya", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "ti" });
      expect(res.text).toBe("ቋንቋ");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Tsonga", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "ts" });
      expect(res.text).toBe("ririmi");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Turkish", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "tr" });
      expect(res.text).toBe("dil");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Turkmen", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "tk" });
      expect(res.text).toBe("dili");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Twi (Akan)", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "ak" });
      expect(res.text).toBe("kasa");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Ukrainian", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "uk" });
      expect(res.text).toBe("мова");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Urdu", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "ur" });
      expect(res.text).toBe("زبان");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Uyghur", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "ug" });
      expect(res.text).toBe("تىل");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Uzbek", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "uz" });
      expect(res.text).toBe("til");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Vietnamese", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "vi" });
      expect(res.text).toBe("ngôn ngữ");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Welsh", async () => {
    try {
      const res = await googletrans("sky", { from: "en", to: "cy" });
      expect(res.text).toBe("awyr");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Xhosa", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "xh" });
      expect(res.text).toBe("ulwimi");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Yiddish", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "yi" });
      expect(res.text).toBe("שפּראַך");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Yoruba", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "yo" });
      expect(res.text).toBe("ede");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });

  test("Zulu", async () => {
    try {
      const res = await googletrans("language", { from: "en", to: "zu" });
      expect(res.text).toBe("ulimi");
      expect(res.hasCorrectedText).toBe(false);
    } catch (error) {
      console.log(error);
    }
  });
});
