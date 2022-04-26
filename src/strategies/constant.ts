export function constant(clientSecret: string | Record<string, string>) {
  return (clientId: string) => {
    if (typeof clientSecret === "string" && clientSecret) return clientSecret;
    if (typeof clientSecret === "object" && clientSecret[clientId]) return clientSecret[clientId];

    throw new Error("Secret not found");
  };
}
