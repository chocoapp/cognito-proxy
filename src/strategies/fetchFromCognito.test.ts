const secretMap: Record<string, any> = {
  "test-pool-id-test-client-id": {
    UserPoolClient: { ClientSecret: "secret" },
  },
};

const cognitoInstance = {
  describeUserPoolClient: jest.fn(
    ({ UserPoolId, ClientId }: { ClientId: string; UserPoolId: string }) => {
      return {
        promise: () => {
          return secretMap[`${UserPoolId}-${ClientId}`];
        },
      };
    }
  ),
};

jest.mock("aws-sdk", () => {
  return {
    CognitoIdentityServiceProvider: jest.fn(() => cognitoInstance),
  };
});

import { fetchFromCognito } from "./fetchFromCognito";

describe("fetchFromCognito", () => {
  it("succeeds", async () => {
    const strategy = fetchFromCognito({
      "test-client-id": "test-pool-id",
    });

    await expect(strategy("test-client-id")).resolves.toBe("secret");
  });

  test("fails ", async () => {
    const strategy = fetchFromCognito({
      "test-client-id": "test-pool-id",
    });

    await expect(strategy("wrong")).resolves.toBe(undefined);
  });
});
