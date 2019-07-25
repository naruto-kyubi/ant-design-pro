import request from '@/utils/request';

export async function queryProvince() {
  return request('/server/api/v1/geographic/province');
}

export async function queryCity(province) {
  return request(`/server/api/v1/geographic/city/${province}`);
}
