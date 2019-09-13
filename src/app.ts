import express from 'express';
import bodyParser from 'body-parser';
import { registerRoutes } from './routes';
import { options } from 'joi';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../swagger.json';

const app = express();
const port = 3000;

class App {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.middleware();
    this.setupRoutes();

    this.app.listen(port, err => {
      if (err) {
        return console.error(err);
      }
      return console.log(`server is listening on ${port}`);
    });
  }

  private middleware(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  private setupRoutes(): void {
    registerRoutes(this.app);
  }

}

new App();
