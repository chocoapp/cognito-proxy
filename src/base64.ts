export function encode(body: object): string {
  return Buffer.from(JSON.stringify(body)).toString("base64");
}

export function decode(body?: string): object {
  if (!body) throw new Error("Invalid body");

  return JSON.parse(Buffer.from(body, "base64").toString("utf-8"));
}
