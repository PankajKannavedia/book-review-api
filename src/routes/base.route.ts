import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';

class BaseRoute implements Routes {
  public path;
  public controller;
  public router = Router();

  constructor(controller?: any, path?: string) {
    if (controller) {
      this.controller = controller;
    }
    if (path) {
      this.path = path;
    }
    this.initializeRoutes();
  }

  protected setController(controller: any) {
    this.controller = controller;
    return this;
  }

  protected getController() {
    return this.controller;
  }

  initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.controller.getAll);
    this.router.get(`${this.path}/:id`, authMiddleware, this.controller.getById);
    this.router.post(`${this.path}`, authMiddleware, this.controller.create);
    this.router.put(`${this.path}/:id`, authMiddleware, this.controller.update);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.controller.delete);
  }
}

export default BaseRoute;
