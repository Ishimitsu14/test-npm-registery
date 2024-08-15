import { Ctx, Message, Start, Update } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';

@Update()
export class TelegramController {
  @Start()
  async start(@Ctx() ctx: Scenes.SceneContext, @Message('text') payload) {
    let code: string | null = null;
    const splitMessage = payload.split(' ');
    if (splitMessage[1]) {
      code = splitMessage[1];
    }

    await ctx.scene.enter('registration', { code, firstName: null, lastName: null, codeIsExpired: false });
  }
}
