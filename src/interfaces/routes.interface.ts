import { Router } from 'express';
import ControllerInterface from './controller.interface';

export interface Routes {
  path?: string;
  router: Router;
  controller?: ControllerInterface;
}
