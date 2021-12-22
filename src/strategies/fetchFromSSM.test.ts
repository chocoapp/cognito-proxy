const secretMap: Record<string, string> = {
  "my-fn": "Function OK",
  "test.123": "Custom OK",
};

const smInstance = {
  getSecretValue: jest.fn(({ SecretId }: { SecretId: string }) => {
    return {
      promise: () => {
        // console.log({ SecretId });
        return { SecretString: secretMap[SecretId] };
      },
    };
  }),
};

jest.mock("aws-sdk", () => {
  return {
    SecretsManager: jest.fn(() => smInstance),
  };
});

import { fetchFromSSM } from "./fetchFromSSM";

describe("fetchFromSSM", () => {
  it("succeeds based on fn name", async () => {
    process.env.AWS_LAMBDA_FUNCTION_NAME = "test.my-fn.test";

    const strategy = fetchFromSSM();

    await expect(strategy("...")).resolves.toBe("Function OK");
  });

  it("fails based on fn name", async () => {
    process.env.AWS_LAMBDA_FUNCTION_NAME = "test.wrong.test";

    const strategy = fetchFromSSM();

    await expect(strategy("...")).resolves.toBe(undefined);
  });

  it("succeeds with custom secret lookup", async () => {
    const strategy = fetchFromSSM({
      secretIdLookup: (clientId) => `test.${clientId}`,
    });

    await expect(strategy("123")).resolves.toBe("Custom OK");
  });

  it("fails with custom secret lookup", async () => {
    const strategy = fetchFromSSM({
      secretIdLookup: () => `wrong`,
    });

    await expect(strategy("123")).resolves.toBe(undefined);
  });
});
