import { encode, decode } from "./base64";

it("encode/decodes body", () => {
  expect(decode(encode({ a: 1 }))).toEqual({ a: 1 });
});
