export function constant(clientSecret: string | Record<string, string>) {
  return (clientId: string) => {
    if (typeof clientSecret === "string") return clientSecret;
    if (typeof clientSecret === "object") return clientSecret[clientId];

    throw new Error("Secret not found");
  };
}
