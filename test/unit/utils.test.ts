import { getRandom, getUserAgent } from "../../src/utils";

describe("utils", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("getRandom includes both integer boundaries", () => {
    jest.spyOn(Math, "random").mockReturnValueOnce(0).mockReturnValueOnce(0.999999);

    expect(getRandom(3, 7)).toBe(3);
    expect(getRandom(3, 7)).toBe(7);
  });

  test("getUserAgent returns a configured browser user agent", () => {
    jest.spyOn(Math, "random").mockReturnValue(0);

    expect(getUserAgent()).toEqual(expect.any(String));
    expect(getUserAgent().length).toBeGreaterThan(10);
  });
});
