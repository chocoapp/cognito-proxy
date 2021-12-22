import { genSecret } from "./secret";

it(`generates secret hash for client`, () => {
  expect(genSecret("+46123456789", "someKey", "someSecret")).toBe(
    "IaGDgKDFGW4GZ/M+pkM2lX0gN/su2fC8n1H7zW+mIUE="
  );
});
