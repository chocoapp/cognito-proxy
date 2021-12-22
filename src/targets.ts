import { genSecret } from "./secret";
import { Target, DefaultBody, TargetBody } from "./types";

type TargetHandler = (
  body: any,
  clientId: string,
  clientSecret: string
) => void;

export function isHandledTarget(target?: string): target is Target {
  return Object.values(Target).includes(target as Target);
}

const defaultHandler: TargetHandler = (
  body: DefaultBody,
  clientId,
  clientSecret
) => {
  body.SecretHash = genSecret(body.Username, clientId, clientSecret);
};

const targetHandlers: Record<Target, TargetHandler> = {
  // When the AuthFlow is REFRESH_TOKEN_AUTH, Cognito is happy with receiving the
  // clientSecret instead of the calculated secretHash
  [Target.InitiateAuth]: (
    body: TargetBody[Target.InitiateAuth],
    clientId,
    clientSecret
  ) => {
    body.AuthParameters.SECRET_HASH =
      body.AuthFlow === "REFRESH_TOKEN_AUTH"
        ? clientSecret
        : genSecret(body.AuthParameters.USERNAME, clientId, clientSecret);
  },
  [Target.RespondToAuthChallenge]: (
    body: TargetBody[Target.RespondToAuthChallenge],
    clientId,
    clientSecret
  ) => {
    body.ChallengeResponses.SECRET_HASH = genSecret(
      body.ChallengeResponses.USERNAME,
      clientId,
      clientSecret
    );
  },

  // When the target is RevokeToken Cognito is happy getting only the clientSecret
  [Target.RevokeToken]: (
    body: TargetBody[Target.RevokeToken],
    _,
    clientSecret
  ) => {
    body.ClientSecret = clientSecret;
  },

  [Target.SignUp]: defaultHandler,
  [Target.ConfirmSignUp]: defaultHandler,
  [Target.ForgotPassword]: defaultHandler,
  [Target.ConfirmForgotPassword]: defaultHandler,
  [Target.ResendConfirmationCode]: defaultHandler,
};

export function handleTarget(
  target: Target,
  body: TargetBody[Target],
  clientId: string,
  clientSecret: string
) {
  targetHandlers[target](body, clientId, clientSecret);
}
