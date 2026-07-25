export const basicResponse = {
  status: 200,
  data: [[["你好", "hello", "nǐ hǎo"]], null, "en"],
};

export const batchResponse = {
  status: 200,
  data: [
    [
      ["blauw\n", "blue", null],
      ["groen\n", "green", null],
    ],
    null,
    "en",
  ],
};

export const correctedResponse = {
  status: 200,
  data: [
    [["ik spreek Engels", "I spea English", null]],
    [["verb", ["spreken"], [["spreken", ["speak"]]]]],
    "en",
    null,
    null,
    null,
    null,
    ["I <b><i>speak</i></b> English", null, null, null, null, true],
    [["en"]],
  ],
};
