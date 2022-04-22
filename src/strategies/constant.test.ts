import { constant } from "./constant";

test("constant string", () => {
  const strategy = constant("test");

  expect(strategy("")).toBe("test");
  expect(strategy("")).toBe("test");
  expect(strategy("")).toBe("test");
});

test("constant object", () => {
  const strategy = constant({ a: "b" });

  expect(strategy("a")).toBe("b");
  expect(() => strategy("")).toThrow("Secret not found");
});
