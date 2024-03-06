import { request } from './http-client.utils';

export default class UserApiService {
  static getOrders = () =>
    request({
      path: `/api/v2/orders`,
      method: 'GET',
    });
}
