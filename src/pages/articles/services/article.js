import { stringify } from 'qs';

import request from '@/utils/request';

export async function queryList(payload) {
  return request(`/naruto/v1/article/query?${stringify(payload)}`);
}

export async function queryById(payload) {
  const { id } = payload;
  return request(`/naruto/v1/articles/${id}`);
}

export async function queryCatalog(payload) {
  return request(`/naruto/v1/catalogs/query?${stringify(payload)}`);
}

export async function add(payload) {
  return request('/naruto/v1/article/add', {
    method: 'POST',
    data: payload,
  });
}
