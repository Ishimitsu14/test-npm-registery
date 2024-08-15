export enum REGISTRATION_WIZARD_STEP_ENUM {
  VERIFY_CODE_SCENE = 0,
  GET_USER_FIRST_NAME_SCENE = 1,
  GET_USER_LAST_NAME_SCENE = 2,
}

export interface RegistrationSceneState {
  code?: string;
  codeIsExpired?: boolean;
  firstName: string | null;
  lastName: string | null;
}

export const RegistrationWizardMiddleware = async (ctx: any, next: () => Promise<void>) => {
  const currentStep = ctx.wizard.cursor;
  const message = ctx.message?.text;
  ctx.wizard.state.username = ctx.from.username;

  if (ctx.wizard.state.codeIsExpired) {
    ctx.wizard.state.code = message;
    ctx.wizard.state.codeIsExpired = false;
  }

  switch (currentStep) {
    case REGISTRATION_WIZARD_STEP_ENUM.VERIFY_CODE_SCENE:
      if (!ctx.wizard.state.code && message !== '/start') {
        ctx.wizard.state.code = ctx.wizard.state.code || message;
      }
      break;
    case REGISTRATION_WIZARD_STEP_ENUM.GET_USER_FIRST_NAME_SCENE:
      ctx.wizard.state.firstName = message;
      break;
    case REGISTRATION_WIZARD_STEP_ENUM.GET_USER_LAST_NAME_SCENE:
      ctx.wizard.state.lastName = message;
      break;
  }

  await next();
};
