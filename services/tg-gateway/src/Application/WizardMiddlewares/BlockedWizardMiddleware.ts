export const BlockedWizardMiddleware = async (ctx: any, next: () => Promise<void>) => {
  if (ctx?.update?.my_chat_member?.new_chat_member?.status !== 'kicked') {
    await next();
  }
};
