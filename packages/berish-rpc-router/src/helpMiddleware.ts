import { Router } from './router';

export function helpMiddleware(router: Router): Router {
  const baseRouter = Router();

  const serviceRouter = Router();
  serviceRouter.add('help', () => baseRouter.getMap());

  baseRouter.add('service', serviceRouter);
  baseRouter.use(router);
  return baseRouter;
}
