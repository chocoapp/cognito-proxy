import { encode, decode } from "./base64";
import { CloudFrontRequestEvent, CloudFrontRequest } from "aws-lambda";
import { isHandledTarget, handleTarget } from "./targets";
import type { TargetBody, Lookup } from "./types";

export function createHandler({
  secretLookup,
  logger,
}: {
  secretLookup: Lookup;
  logger?: typeof console;
}) {
  return async function handler(
    event: CloudFrontRequestEvent
  ): Promise<CloudFrontRequest> {
    logger?.info(JSON.stringify({ message: "event", event }));

    if (!event.Records) throw new Error("Invalid event");

    const { request } = event.Records[0].cf;

    if (request.method === "POST" && request.body?.data) {
      const target = request.headers["x-amz-target"]
        ? request.headers["x-amz-target"][0].value
        : undefined;

      logger?.info(JSON.stringify({ message: "target", target }));

      if (isHandledTarget(target)) {
        const body = decode(request.body.data) as TargetBody[typeof target];

        const { ClientId: clientId } = body;

        const clientSecret = await secretLookup(clientId);

        if (!clientSecret) throw new Error("Invalid ClientId");

        logger?.info(JSON.stringify({ message: "body", body }));

        handleTarget(target, body, clientId, clientSecret);

        request.body.action = "replace";
        request.body.data = encode(body);
      }
    }

    return request;
  };
}
