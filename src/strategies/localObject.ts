export function localObject(secretMap: Record<string, string>) {
  return (clientId: string) => {
    return secretMap[clientId];
  };
}
