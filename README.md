# googletrans

> Free and Unlimited Google translate API for node.js

[![Build Status](https://travis-ci.com/DarinRowe/googletrans.svg?branch=master)](https://travis-ci.com/DarinRowe/googletrans)
[![Coverage Status](https://coveralls.io/repos/github/DarinRowe/googletrans/badge.svg?branch=master)](https://coveralls.io/github/DarinRowe/googletrans?branch=master)
[![install size](https://badgen.net/bundlephobia/minzip/googletrans)](https://bundlephobia.com/result?p=googletrans)
[![GitHub](https://img.shields.io/github/license/DarinRowe/googletrans)](https://www.npmjs.com/package/googletrans)
[![npm](https://img.shields.io/npm/v/googletrans)](https://www.npmjs.com/package/googletrans)

## Features

- Fast and reliable
- Batch translation
- Auto language detection
- Spelling correction
- Language correction
- HTTP/2 support
- Connection pooling

## TODO

- Remove qs dependencies

## Installing

Using npm

```bash
npm i -S googletrans
```

Using yarn

```bash
yarn add googletrans
```

## Example

### CommonJS usage

In order to gain the TypeScript typings (for intellisense / autocomplete) while using CommonJS imports with `require()` use the following approach:

```javascript
const axios = require('axios').default;
```

### Basic usage : 

Auto language detection.

```javascript
const tr = require("googletrans").default;

// Promise
tr("vue", "en")
  .then((res) => {
    // handle success
    console.log(res.text); // view
  })
  .catch((error) => {
    // handle error
    console.log(error);
  });

// Want to use async/await？
async function translation() {
 try {
      const res = await googletrans("vue", "en");
      console.log(res.text); // view
    } catch (error) {
      console.log(error);
    }
}
```

### Batch translation：

An array can be used to translate a batch of texts.

```javascript
const tr = require("googletrans").default;

tr(["Saluton", "Mondo"], "en")
  .then((res) => {
    console.log(res.textArray); // [ 'Hello', 'world' ]
  })
  .catch((error) => {
    console.log(error);
  });

```

> **NOTE:**  The first element of the text array can not empty.

### Spelling correction:

  If the API suggests a correction text,  `from.correct.hasCorrectedText` equals to `true`.

 In this case, it will have the corrections delimited with brackets (`[ ]`):

```javascript
const tr = require("googletrans").default;

tr("I spea English", "en")
  .then((res) => {
    console.log(res.from.correct.hasCorrectedText); // true
  	console.log(res.from.correct.value:); // I [speak] English
  })
  .catch((error) => {
    console.log(error);
  });
```

### Language correction:

```javascript
const tr = require("googletrans");

tr.translate("vue", { from: "en", to: "nl" })
  .then((res) => {
    console.log(res.from.language.hasCorrectedLang); // true
    console.log(res.from.language.iso); // fr
  })
  .catch((error) => {
    console.log(error);
  });
```

## TypeScript

googletrans includes [TypeScript](http://typescriptlang.org/) definitions.

```javascript
import tr from "googletrans";
```



## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2020-present, Darin Lo
