# googletrans

> Free and Unlimited Google translate API for node.js

[![Build Status](https://travis-ci.com/DarinRowe/googletrans.svg?branch=master)](https://travis-ci.com/DarinRowe/googletrans)
[![Coverage Status](https://coveralls.io/repos/github/DarinRowe/googletrans/badge.svg?branch=master)](https://coveralls.io/github/DarinRowe/googletrans?branch=master)
[![install size](https://badgen.net/bundlephobia/minzip/googletrans)](https://bundlephobia.com/result?p=googletrans)
[![GitHub](https://img.shields.io/github/license/DarinRowe/googletrans)](https://github.com/DarinRowe/googletrans/blob/master/LICENSE.md)
[![npm](https://img.shields.io/npm/v/googletrans)](https://www.npmjs.com/package/googletrans)

<!-- https://badgen.net/packagephobia/publish/googletrans -->

<!-- https://badgen.net/bundlephobia/min/googletrans -->

## Features

- Fast and reliable
- Batch translation
- Auto language detection
- Spelling correction
- HTTP/2 support
- Connection pooling

## Installing

Using npm

```bash
npm i -S googletrans
```

Using yarn

```bash
yarn add googletrans
```

## CommonJS usage

To gain the TypeScript typings (for intellisense / autocomplete) while using CommonJS imports with `require()` use the following approach:

```javascript
const tr = require("googletrans").default;
```

## Super simple to use

### Basic Usage

```javascript
const tr = require("googletrans").default;

// Promise
tr("vue")
  .then(function (result) {
    console.log(result.text); // view
    console.log(result.src); // fr
  })
  .catch(function (error) {
    console.log(error);
  });

// Want to use async/await？
async function translation() {
  try {
    const result = await tr("vue");
    console.log(result.text); // view
    console.log(result.src); // fr
  } catch (error) {
    console.log(error);
  }
}
```

### Batch translation

An array can be used to translate a batch of texts.

```javascript
// eo => en
tr(["Saluton", "Mondo"])
  .then(function (result) {
    console.log(result.textArray); // [ 'Hello', 'world' ]
    console.log(result.src); // eo
  })
  .catch(function (error) {
    console.log(error);
  });

// en => de
tr(["Hello", "world"], "de")
  .then(function (result) {
    console.log(result.textArray); // [ 'Hallo', 'Welt' ]
    console.log(result.src); // en
  })
  .catch(function (error) {
    console.log(error);
  });
```

> **NOTE:** The first element of the text array can not empty string.

### Spelling correction

If the API suggests a correction text, `hasCorrectedText` will equals to `true`.

In this case, correction text will have the corrections delimited with brackets (`[ ]`), `correctedText` is the crrection text.

```javascript
// en => nl
tr("I spea English", "nl")
  .then(function (result) {
    console.log(result.text); // ik spreek Engels
    console.log(result.hasCorrectedText); // true
    console.log(result.correctedText); // I [speak] English
    console.log(result.src); // en
  })
  .catch(function (error) {
    console.log(error);
  });
```

### More options

- `from` The source language you want to translate. (Default: auto)
- `to` The language you want to translate into.(Default: en)
- `tld` The google translate domain name. In this case, `tld:"co.jp"`it will be uses `translate.google.co.jp`

```javascript
// en => ja
tr("Hello", { from: "en", to: "ja", tld: "co.jp" })
  .then(function (result) {
    console.log(result.text); // こんにちは
    console.log(result.src); // en
  })
  .catch(function (error) {
    console.log(error);
  });
```

### Language correction

If the source language is not right, `hasCorrectedLang` will equal to `true`.

```javascript
tr("Hero", { from: "pt", to: "nl" })
  .then(function (res) {
    console.log(res.hasCorrectedLang); // true
    console.log(res.src); // en
  })
  .catch(function (err) {
    console.log(err);
  });
```

## Languages support

[The support languages.](https://github.com/DarinRowe/googletrans/blob/2cb2ef1eaa5dc2b5cf7492e69ad96d8ed40ea656/src/languages.ts#L6) You can use the short name or the full name.

```javascript
// short name
tr("koa", "en")
  .then(function (result) {
    console.log(result.text); // also
    console.log(result.src); // mg
  })
  .catch(function (error) {
    console.log(error);
  });

// full name
tr("koa", "English")
  .then(function (result) {
    console.log(result.text); // also
    console.log(result.src); // mg
  })
  .catch(function (error) {
    console.log(error);
  });
```

## TypeScript

googletrans includes [TypeScript](http://typescriptlang.org/) definitions.

```javascript
import tr from "googletrans";
```

## Method

```
const tr = require("googletrans").default;
tr(text, options)
```

### Arguments

- text - The text to be translated.
- options - The translation options. If the param is string, mean the language you want to translate into.If the param is object, it can set more options.

### Options

```javascript
// string
"en";

// object
{
  // The language you want to translate into.(Default: en)
  to: "en";
  // The source language you want to translate. (Default: auto)
  from: "fr";
  // The google translate domain name
  tld: "co.jp";
}
```

### Returns: Result Schema

The result of a request contains the following information.

```javascript
Result {
  // the translated text.
  text: string;

  // array of the translated text.
  textArray: string[];

  // pronunciation
  pronunciation: string;

  // has correct source language?
  hasCorrectedLang: boolean;

  // source language
  src: string;

  // has correct source text?
  hasCorrectedText: boolean;

  // correct source text
  correctedText: string;

  // multiple translations
  translations: [];

  // the raw response from Google Translate servers.
  raw: [];
}
```

## NOTE

DISCLAIMER: this is an unofficial library using the web API of Google Translate and also is not associated with Google.

- **The maximum character limit on a single text is 15k.**
- Due to limitations of the web version of google translate, this API does not guarantee that the library would work properly at all times (so please use this library if you don't care about stability).
- If you want to use a stable API, I highly recommend you to use [Google's official translate API](https://cloud.google.com/translate/docs).

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2020-present, Darin Lo
