import { NextFunction, Request, Response } from 'express';

export default interface ControllerInterface {
  getAll(req: Request, res: Response, next: NextFunction): any;
  getById(req: Request, res: Response, next: NextFunction): any;
  create(req: Request, res: Response, next: NextFunction): any;
  update(req: Request, res: Response, next: NextFunction): any;
  delete(req: Request, res: Response, next: NextFunction): any;
}
