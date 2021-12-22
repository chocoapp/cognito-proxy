export function localMap(secretMap: Map<string, string>) {
  return (clientId: string) => {
    return secretMap.get(clientId);
  };
}
