import * as crypto from "crypto";

export function genSecret(
  userName: string,
  clientId: string,
  clientSecret: string
) {
  return crypto
    .createHmac("SHA256", clientSecret)
    .update(userName + clientId)
    .digest("base64");
}
