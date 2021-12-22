import { SecretsManager } from "aws-sdk";
import { Lookup } from "../types";
function functionName() {
  return process.env.AWS_LAMBDA_FUNCTION_NAME?.split(".")[1];
}

export function fetchFromSSM(
  { secretIdLookup }: { secretIdLookup: Lookup } = {
    secretIdLookup: functionName,
  }
) {
  const sm = new SecretsManager();

  return async (clientId: string) => {
    const secretId = await secretIdLookup(clientId);

    if (!secretId) throw new Error("Secret Id not found");

    const result = await sm.getSecretValue({ SecretId: secretId }).promise();

    return result.SecretString;
  };
}
