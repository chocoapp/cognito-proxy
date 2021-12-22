import { encode, decode } from "./base64";
import { createHandler } from ".";
import { CloudFrontRequestEvent } from "aws-lambda";
import { genSecret } from "./secret";

const defaultTargets = [
  "SignUp",
  "ConfirmSignUp",
  "ForgotPassword",
  "ConfirmForgotPassword",
  "ResendConfirmationCode",
];

const clientId = "test-client-id";
const clientSecret = "test-client-secret";
const userUUID = "0a257372-69f7-4b34-897d-f55b6b4b931f";
const userName = "+44111222333";
const secretHash = genSecret(userName, clientId, clientSecret);

const secretLookup = (clientId: string) => {
  return { "test-client-id": "test-client-secret" }[clientId];
};
const handler = createHandler({ secretLookup });

it("does not rewrite if not POST", async () => {
  const result = await handler(genEvent("GET", "SignUp"));

  expect(decode(result.body?.data)).toEqual({
    Username: userName,
    ClientId: clientId,
  });
});

it("logs relevant info if logger is provided", async () => {
  const info = jest.fn();

  const handler = createHandler({
    secretLookup,
    logger: { ...console, info },
  });

  await handler(genEvent("POST", "SignUp"));

  expect(info).toHaveBeenCalledTimes(3);

  expect(info).toHaveBeenCalledWith(
    JSON.stringify({
      message: "event",
      // If you use the original event it is modified by the function
      event: genEvent("POST", "SignUp"),
    })
  );

  expect(info).toHaveBeenCalledWith(
    JSON.stringify({
      message: "target",
      target: "AWSCognitoIdentityProviderService.SignUp",
    })
  );

  expect(info).toHaveBeenCalledWith(
    JSON.stringify({
      message: "body",
      body: { ClientId: "test-client-id", Username: "+44111222333" },
    })
  );
});

describe.each(defaultTargets)(`%s`, (target) => {
  it("rewrites body", async () => {
    const result = await handler(genEvent("POST", target));

    expect(decode(result.body?.data)).toEqual({
      Username: userName,
      ClientId: clientId,
      SecretHash: secretHash,
    });
  });

  it("rewrites body with additional keys", async () => {
    const result = await handler(genEvent("POST", target, { a: 1, b: 2 }));

    expect(decode(result.body?.data)).toEqual({
      Username: userName,
      ClientId: clientId,
      SecretHash: secretHash,
      a: 1,
      b: 2,
    });
  });
});

describe("InitiateAuth", () => {
  it("rewrites body with client secret if refresh", async () => {
    const result = await handler(
      genEvent("POST", "InitiateAuth", { AuthFlow: "REFRESH_TOKEN_AUTH" })
    );

    expect(decode(result.body?.data)).toEqual({
      AuthParameters: {
        USERNAME: userName,
        SECRET_HASH: clientSecret,
      },
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: clientId,
    });
  });

  it("rewrites body with secret hash if not refresh", async () => {
    const result = await handler(genEvent("POST", "InitiateAuth"));

    expect(decode(result.body?.data)).toEqual({
      AuthParameters: {
        USERNAME: userName,
        SECRET_HASH: secretHash,
      },
      ClientId: clientId,
    });
  });
});

describe("RevokeToken", () => {
  it("rewrites body", async () => {
    const result = await handler(genEvent("POST", "RevokeToken"));

    expect(decode(result.body?.data)).toEqual({
      ClientSecret: clientSecret,
      ClientId: clientId,
    });
  });
});

describe("RespondToAuthChallenge", () => {
  it("rewrites body", async () => {
    const result = await handler(genEvent("POST", "RespondToAuthChallenge"));

    expect(decode(result.body?.data)).toEqual({
      ChallengeResponses: {
        USERNAME: userUUID,
        SECRET_HASH: genSecret(userUUID, clientId, clientSecret),
      },
      ClientId: clientId,
    });
  });
});

function genBody(target: string, extraKeys: object = {}) {
  if (target === "InitiateAuth") {
    return {
      ClientId: clientId,
      AuthParameters: { USERNAME: userName },
      ...extraKeys,
    };
  }

  if (target === "RespondToAuthChallenge") {
    return {
      ClientId: clientId,
      ChallengeResponses: { USERNAME: userUUID },
      ...extraKeys,
    };
  }

  if (target === "RevokeToken") {
    return {
      ClientId: clientId,
      ...extraKeys,
    };
  }

  return {
    ClientId: clientId,
    Username: userName,
    ...extraKeys,
  };
}

function genEvent(
  method: string,
  target: string,
  extraKeys: object = {}
): CloudFrontRequestEvent {
  return {
    Records: [
      {
        cf: {
          config: {
            distributionDomainName: "...",
            distributionId: "...",
            eventType: "origin-request",
            requestId: "...",
          },
          request: {
            method,
            clientIp: "10.0.0.1",
            uri: "/",
            querystring: "",
            headers: {
              "x-amz-target": [
                { value: `AWSCognitoIdentityProviderService.${target}` },
              ],
            },
            body: {
              action: "replace",
              encoding: "base64",
              data: encode(genBody(target, extraKeys)),
              inputTruncated: false,
            },
          },
        },
      },
    ],
  };
}
