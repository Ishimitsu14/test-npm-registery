import { forwardRef, Inject } from '@nestjs/common';
import { TgGatewayConfig } from '@shared/config';
import { Ctx, Message, Wizard, WizardStep } from 'nestjs-telegraf';
import { Markup, Scenes } from 'telegraf';

import { AuthService } from '../Application';
import { BlockedWizardMiddleware, REGISTRATION_WIZARD_STEP_ENUM, RegistrationSceneState, RegistrationWizardMiddleware } from '../Application/WizardMiddlewares';

@Wizard('registration', {
  leaveHandlers: [],
  enterHandlers: [],
  handlers: [BlockedWizardMiddleware, RegistrationWizardMiddleware],
})
export class AuthWizardTelegramController {
  @Inject(forwardRef(() => AuthService))
  private readonly authService: AuthService;

  @WizardStep(REGISTRATION_WIZARD_STEP_ENUM.VERIFY_CODE_SCENE)
  async verifyCodeScene(@Ctx() ctx: Scenes.WizardContext) {
    try {
      const state = ctx.wizard.state as RegistrationSceneState;

      if (!state.code) {
        await ctx.reply('Hi, please enter the code');
      } else {
        const telegramAuthCode = await this.authService.validateUserByCode({ code: state.code, username: ctx.from.username });

        if (telegramAuthCode.userPK) {
          await this.endRegistration(ctx);
        } else {
          await ctx.reply('Hello, what your name?');
          await ctx.wizard.next();
        }
      }
    } catch (e: any) {
      (ctx.wizard.state as RegistrationSceneState).code = null;
      await ctx.reply(e.message);
    }
  }

  @WizardStep(REGISTRATION_WIZARD_STEP_ENUM.GET_USER_FIRST_NAME_SCENE)
  async getUserFirstNameScene(@Ctx() ctx: Scenes.WizardContext) {
    try {
      const state = ctx.wizard.state as RegistrationSceneState;

      await ctx.reply(`Hi, ${state.firstName}, what your last name?`);
      await ctx.wizard.next();
    } catch (e: any) {
      await ctx.reply(e.message);
    }
  }

  @WizardStep(REGISTRATION_WIZARD_STEP_ENUM.GET_USER_LAST_NAME_SCENE)
  async getUserLastNameScene(@Ctx() ctx: Scenes.WizardContext, @Message('text') msg: string) {
    try {
      const state = ctx.wizard.state as RegistrationSceneState;

      await this.authService.signIn({
        code: state.code,
        firstName: state.firstName,
        lastName: state.lastName,
        username: ctx.from.username,
      });

      await this.endRegistration(ctx);
    } catch (e: any) {
      (ctx.wizard.state as RegistrationSceneState).codeIsExpired = true;
      await ctx.reply(e.message);
    }
  }

  private async endRegistration(ctx: Scenes.WizardContext) {
    await ctx.reply(
      "You're logged in and can return to Marsbase desk.",
      Markup.inlineKeyboard([Markup.button.webApp('Open in telegram', TgGatewayConfig.bot.url), Markup.button.url('Open in Browser', TgGatewayConfig.bot.url)]),
    );

    await ctx.scene.leave();
  }
}
