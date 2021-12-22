import { localMap } from "./localMap";

test("localMap", () => {
  const strategy = localMap(
    new Map([
      ["a", "b"],
      ["c", "d"],
    ])
  );

  expect(strategy("a")).toBe("b");
  expect(strategy("c")).toBe("d");
  expect(strategy("x")).toBe(undefined);
});
