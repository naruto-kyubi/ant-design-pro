import { stringify } from 'qs';

import request from '@/utils/request';

export async function queryArticles(payload) {
  //  return request(`/naruto/v1/article/query`);
  return request(`/naruto/v1/article/query?${stringify(payload)}`);
}

export async function addArticle(payload) {
  return request('/naruto/v1/article/add', {
    method: 'POST',
    data: payload,
  });
}
