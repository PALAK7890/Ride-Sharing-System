import express, { NextFunction, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { openApiSpec } from './config/openApiSpec';
import { Routes } from './utils/route.interface';

class App {
  public app: express.Application;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = Number(process.env.PORT ?? 3000);
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeDocs();
    this.initializeErrorHandling();
  }

  public startServer() {
    this.app.listen(this.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server listening on http://localhost:${this.port}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      if (req.method === 'OPTIONS') {
        res.sendStatus(204);
        return;
      }

      next();
    });

    this.app.use(express.json());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use('/', route.router);
    });
  }

  private initializeDocs() {
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
  }

  private initializeErrorHandling() {
    this.app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
      res.status(400).json({ error: error.message });
    });
  }
}

export default App;
