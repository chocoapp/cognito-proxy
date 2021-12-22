type Maybe<T> = T | undefined;
type MaybeAsync<T> = Promise<T> | T;

export type Lookup = (key: string) => MaybeAsync<Maybe<string>>;

export type DefaultBody = {
  ClientId: string;
  SecretHash: string;
  Username: string;
};

export enum Target {
  InitiateAuth = "AWSCognitoIdentityProviderService.InitiateAuth",
  RespondToAuthChallenge = "AWSCognitoIdentityProviderService.RespondToAuthChallenge",
  RevokeToken = "AWSCognitoIdentityProviderService.RevokeToken",
  SignUp = "AWSCognitoIdentityProviderService.SignUp",
  ConfirmSignUp = "AWSCognitoIdentityProviderService.ConfirmSignUp",
  ForgotPassword = "AWSCognitoIdentityProviderService.ForgotPassword",
  ConfirmForgotPassword = "AWSCognitoIdentityProviderService.ConfirmForgotPassword",
  ResendConfirmationCode = "AWSCognitoIdentityProviderService.ResendConfirmationCode",
}

export type TargetBody = {
  [Target.InitiateAuth]: DefaultBody & {
    AuthParameters: {
      USERNAME: string;
      SECRET_HASH: string;
    };
    AuthFlow: string;
  };

  [Target.RespondToAuthChallenge]: DefaultBody & {
    ChallengeResponses: {
      USERNAME: string;
      SECRET_HASH: string;
    };
  };

  [Target.RevokeToken]: DefaultBody & {
    ClientSecret: string;
  };
  [Target.SignUp]: DefaultBody;
  [Target.ConfirmSignUp]: DefaultBody;
  [Target.ForgotPassword]: DefaultBody;
  [Target.ConfirmForgotPassword]: DefaultBody;
  [Target.ResendConfirmationCode]: DefaultBody;
};
