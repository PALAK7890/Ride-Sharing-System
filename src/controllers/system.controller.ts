import { Request, Response } from 'express';
import { openApiSpec } from '../config/openApiSpec';

class SystemController {
  public health = (_req: Request, res: Response): void => {
    res.status(200).json({ status: 'ok' });
  };

  public openApi = (_req: Request, res: Response): void => {
    res.status(200).json(openApiSpec);
  };
}

export default SystemController;
