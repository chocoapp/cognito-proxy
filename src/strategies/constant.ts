export function constant(clientSecret: string) {
  return () => {
    return clientSecret;
  };
}
