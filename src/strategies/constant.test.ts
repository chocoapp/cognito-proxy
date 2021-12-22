import { constant } from "./constant";

test("constant", () => {
  const strategy = constant("test");

  expect(strategy()).toBe("test");
  expect(strategy()).toBe("test");
  expect(strategy()).toBe("test");
});
