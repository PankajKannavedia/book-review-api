export default interface ServiceInterface {
  findAll(params: any): any;
  findById(params: any): any;
  create(params: any): any;
  update(id: any, data: any): any;
  delete(params: any): any;
}
