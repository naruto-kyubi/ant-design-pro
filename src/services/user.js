import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/server/api/v1/user/currentUser');
}

export async function queryUserById(payload) {
  const { id } = payload;
  return request(`/server/api/v1/users/${id}`);
}
