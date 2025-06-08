import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import ServiceInterface from '@/interfaces/service.interface';

class BaseService implements ServiceInterface {
  public model: any;
  public modelClass: any;
  constructor(model?: any) {
    if (model) {
      this.model = model;
    }
  }

  protected setModelClass(modelClass: any) {
    this.modelClass = modelClass;
    return this;
  }

  protected getModelClass() {
    return this.modelClass;
  }

  protected setService(model: any) {
    this.model = model;
    return this;
  }

  protected getService() {
    return this.model;
  }

  async findFuzzy(query: any) {
    try {
      const a = await this.model.fuzzySearch(query);
      return a;
    } catch (error) {
      throw new HttpException(error.status, error);
    }
  }

  async addNgrams(attrs: string[]) {
    const cursor = this.model.find().cursor();

    const promises = [];
    for await (const doc of cursor) {
      const obj = attrs.reduce((acc, attr) => ({ ...acc, [attr]: doc[attr] }), {});
      promises.push(this.model.findByIdAndUpdate(doc._id, obj));
    }

    await Promise.all(promises);
    return true;
  }

  public async findAll(query: any = null): Promise<any> {
    const data: any = await this.model.find();
    return data;
  }

  public async findById(id: string): Promise<any> {
    if (isEmpty(id)) throw new HttpException(400, 'id is empty');

    const find: any = await this.model.findOne({ _id: id });
    if (!find) throw new HttpException(409, "Entity doesn't exist");

    return find;
  }

  public async create(data: any): Promise<any> {
    if (isEmpty(data)) throw new HttpException(400, 'data is empty');
    const createData: any = await this.model.create(data);

    return await createData.save();
  }

  public async update(id: string, data: any): Promise<any> {
    if (isEmpty(data)) throw new HttpException(400, 'data is empty');
    const updateById: any = await this.model.findByIdAndUpdate(id, { $set: data }, { new: true });

    if (!updateById) throw new HttpException(409, "Entity doesn't exist");

    return updateById;
  }

  public async delete(id: string): Promise<any> {
    const deleteById: any = await this.model.findByIdAndDelete(id);
    if (!deleteById) throw new HttpException(409, "Entity doesn't exist");

    return deleteById;
  }
}

export default BaseService;
