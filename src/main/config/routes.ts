import { Express, Router } from "express";
import fg from 'fast-glob';

import swaggerUI from 'swagger-ui-express';
import swaggerDocument from '../../../swagger.json';

export default (app: Express): void => {
  const router = Router();
  app.use('/api', router);
  app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
  fg.sync('**/src/main/routes/**routes.ts').map(async file => (await import(`../../../${file}`)).default(router));
}
