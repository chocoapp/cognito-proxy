import { CognitoIdentityServiceProvider } from "aws-sdk";

export function fetchFromCognito(userPoolMap: Record<string, string>) {
  const cognito = new CognitoIdentityServiceProvider();

  return async (clientId: string) => {
    const res = await cognito
      .describeUserPoolClient({
        UserPoolId: userPoolMap[clientId],
        ClientId: clientId,
      })
      .promise();

    return res?.UserPoolClient?.ClientSecret;
  };
}
