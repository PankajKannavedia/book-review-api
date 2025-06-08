import { NextFunction, Request, Response } from 'express';
import ServiceInterface from '@/interfaces/service.interface';
import ControllerInterface from '@/interfaces/controller.interface';

class BaseController implements ControllerInterface {
  service: any;
  constructor(service?: ServiceInterface) {
    this.service = service;
  }
  //   public userService = new userService();

  protected setService(service: any) {
    this.service = service;
    return this;
  }

  protected getService() {
    return this.service;
  }

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllData: [] = await this.service.findAll();

      res.status(200).json({ data: findAllData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const Id: string = req.params.id;
      const findOneData = await this.service.findById(Id);

      res.status(200).json({ data: findOneData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = { ...req.body, createdBy: req.user._id, updatedBy: req.user._id };
      const createData = await this.service.create(body);

      res.status(201).json({ data: createData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const body = { ...req.body, updatedBy: req.user._id };
      const updateData = await this.service.update(id, body);

      res.status(200).json({ data: updateData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const deleteData = await this.service.delete(id);

      res.status(200).json({ data: deleteData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default BaseController;
